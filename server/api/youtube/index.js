"use strict";

var express = require("express");
var youtubeController = require("./youtubeController");
var router = express.Router();

router.get("/playlists", youtubeController.getPlaylists);
router.get("/playlists/:id", youtubeController.getPlaylistVideos);
router.get("/video/:videoId", youtubeController.getVideo);

module.exports = router;