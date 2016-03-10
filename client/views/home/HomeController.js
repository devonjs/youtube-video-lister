(function(){
    "use strict";
    
    angular.module("jukinApp").controller("HomeController", ["YoutubeService", "$sce", function(Youtube, $sce){
        var home = this;
        
        Youtube.getPlaylists().then(function(result) {
            home.playlists = result;
            home.loadPlaylistVideos(result[0].id);
            home.selectedPlaylistIndex = 0;
        });
        
        home.loadPlaylistVideos = function(id, index) {
            home.selectedPlaylistIndex = index;
            Youtube.getPlaylistVideos(id).then(function(result) {
                console.log(result);
                home.playlistVideos = _.chunk(result, 3);
            });
        };
        
        home.loadVideo = function(videoId) {
            Youtube.getVideo(videoId).then(function(result) {
                home.selectedVideo = result[0];
                home.selectedVideo.publishedAt = moment(home.selectedVideo.publishedAt).format("MMM DD, YYYY");
                home.selectedVideo.viewCount = parseInt(home.selectedVideo.viewCount).toLocaleString();
                home.selectedVideo.videoUrl = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + home.selectedVideo.videoId);
            });
        }
    }]);
})()