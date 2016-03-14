(function(){
    "use strict";
    
    angular.module("jukinApp").controller("HomeController", ["YoutubeService", "$sce", "$document", "$scope", function(Youtube, $sce, $document, $scope){
        var home = this;
        var selectedPlaylist = [];
        var selectedVideoIndex = -1;
        
        Youtube.getPlaylists().then(function(result) {
            home.playlists = result;
            home.loadPlaylistVideos(result[0].id);
            home.selectedPlaylistIndex = 0;
        });
        
        home.loadPlaylistVideos = function(id, index) {
            home.playlistLoading = true;
            home.selectedPlaylistIndex = index;
            Youtube.getPlaylistVideos(id).then(function(result) {
                home.playlistLoading = false;
                selectedPlaylist = _.map(result, "videoId");
                home.playlistVideos = _.chunk(result, 3);
            });
        };
        
        var youtubePlayer;
        var playerObjectLoaded = false;
        var currentVideoId = "";
        
        home.loadVideo = function(videoId) {
            if(currentVideoId !== videoId) {
                selectedVideoIndex = _.indexOf(selectedPlaylist, videoId);
                home.playerLoaded = false;
                Youtube.getVideo(videoId).then(function(result) {
                    home.selectedVideo = result[0];
                    home.selectedVideo.publishedAt = moment(home.selectedVideo.publishedAt).format("MMM DD, YYYY");
                    home.selectedVideo.viewCount = parseInt(home.selectedVideo.viewCount).toLocaleString();
                    home.selectedVideo.videoUrl = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + home.selectedVideo.videoId + "?enablejsapi=1&origin=http://localhost:5000");

                    if(!playerObjectLoaded) {
                        youtubePlayer = new YT.Player('youtubePlayer', { 
                             events: {
                               'onReady': onPlayerReady,
                               'onStateChange': onPlayerStateChange
                             }
                        });
                        // Only need to make the object once.  After that, only the url needs to be changed on the YouTube object
                        playerObjectLoaded = true;
                    }
                });

                currentVideoId = videoId;     
            }       
        };
        
        function onPlayerReady() {
            home.playerLoaded = true;
            
            // onPlayerReady seems to be called outside the Angular application (uses the YouTube iframe API code)
            // therefore Angular doesn't seem to fire its digest cycle when the model changes here, 
            // need to explicitly fire the digest cycle
            
            $scope.$apply();
            
            youtubePlayer.cuePlaylist(
              {
                  playlist: selectedPlaylist,
                  index: selectedVideoIndex,
              }
            );
        };
        
        function onPlayerStateChange(event) {
        };
        
        var iframeScript = document.createElement("script");
        iframeScript.src = "https://www.youtube.com/iframe_api";
        
        var firstIframeScriptTag = document.getElementsByTagName('script')[0];
        firstIframeScriptTag.parentNode.insertBefore(iframeScript, firstIframeScriptTag);
        
        // Stop video when exiting modal event
        angular.element('#myModal').on('hidden.bs.modal', function () {
            youtubePlayer.stopVideo();
        });
    }]);
})()