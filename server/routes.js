"use strict";
var path = require('path');

module.exports = function(app) {
    app.use('/youtube', require("./api/youtube"));
    
    app.route('/*')
      .get(function(req, res) {
        res.sendFile(path.join(__dirname, '../client', 'index.html'));
      });
};