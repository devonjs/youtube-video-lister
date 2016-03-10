(function() {
    "use strict";
    
    angular.module("jukinApp").factory("YoutubeService", ["config", "$http", function(config, $http){
        var service = {};
        var path = config.apiPath + "/youtube";
        
        service.getPlaylists = function() {            
            return $http.get(path + "/playlists").then(function(result){
                return result.data;
            });
        }
        
        service.getPlaylistVideos = function(id) {
            return $http.get(path + "/playlists/" + id,
              {
                  cache: true
              }).then(function(result) {
                  return result.data;
            });
        }
        
        service.getVideo = function(videoId) {
            return $http.get(path + "/video/" + videoId,
            {
                cache: true
            }).then(function(result) {
                return result.data;
            });
        }
        
        return service;
    }]);
})();