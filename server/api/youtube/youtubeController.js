"use strict";

var https = require("https");
var _ = require("lodash");
var apiKey = "AIzaSyDE_mLyjkqO33kUIqFH-DS8R9PLWUQMFz4";	
var channelId = "UCsVXjNRWJMyXViNLM2pyMfg";
var maxResults = 50;

exports.getPlaylists = function(req, res) {
    var path = "/youtube/v3/playlists?part=snippet&channelId=" + channelId + "&maxResults=" + maxResults + "&key=" + apiKey;
    var options = {
        hostname: "www.googleapis.com",
        path: path,
        method: 'GET'
    };
    
    var youtube_req = https.request(options, function(youtube_res) {
        var data = "";
        var resData = [];
        youtube_res.on("data", function(chunk) {
            data += chunk;
        });
        
        youtube_res.on("end", function() {
            data = JSON.parse(data);
            var resData = _.map(data.items, function(d) {
                return {
                  title: d["snippet"]["title"],
                  id: d["id"],
                  thumbnail: d["snippet"]["thumbnails"]["default"]
                };
            });
            res.status(200).send(resData);
        });
    });
    youtube_req.end();
};

exports.getPlaylistVideos = function(req, res) {
    var path = "/youtube/v3/playlistItems?part=snippet,status&playlistId=" + req.params.id + "&maxResults=" + maxResults + "&key=" + apiKey;
    var options = {
        hostname: "www.googleapis.com",
        path: path,
        method: 'GET'
    };
    
    var youtube_req = https.request(options, function(youtube_res) {
        var data = "";
        var resData = [];

        youtube_res.on("data", function(chunk) {
            data += chunk;
        });
        
        youtube_res.on("end", function() {
            data = JSON.parse(data);
            var resData = _.map(data.items, function(d) {
                if(d.status.privacyStatus === "private") {
                    return false;
                }
                else {
                    return {
                      videoId: d["snippet"]["resourceId"]["videoId"],
                      thumbnail: d["snippet"]["thumbnails"]["high"]
                    };
                }
            });
            
            //Remove the private video placeholders
            resData = _.compact(resData);
            res.status(200).send(resData);
        });
    });
    youtube_req.end();
};

exports.getVideo = function(req, res) {
    var path = "/youtube/v3/videos?part=snippet,statistics&id=" + req.params.videoId + "&key=" + apiKey;
    var options = {
        hostname: "www.googleapis.com",
        path: path,
        method: 'GET'
    };
    
    var youtube_req = https.request(options, function(youtube_res) {
        var data = "";
        var resData = [];
        
        youtube_res.on("data", function(chunk) {
            data += chunk;
        });
        
        youtube_res.on("end", function() {
            data = JSON.parse(data);
            var resData = _.map(data.items, function(d) {
                return {
                  videoId: d["id"],
                  publishedAt: d["snippet"]["publishedAt"],
                  title: d["snippet"]["title"],
                  description: d["snippet"]["description"],
                  viewCount: d["statistics"]["viewCount"]
                };
            });
            res.status(200).send(resData);
        });
    });
    youtube_req.end();
};