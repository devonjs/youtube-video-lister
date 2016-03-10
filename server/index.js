(function() {
    'use strict'

    var express = require('express');
    // var config = require('./config');
    var bodyParser = require('body-parser');
    var app = express();
    var path = require('path');
    
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.set('port', process.env.PORT || 5000);
    
    app.use(express.static(path.join(__dirname, '../client')));
      
    require('./routes')(app);

    app.listen(app.get('port'), function() {
      console.log("Node app is running at localhost:" + app.get('port'));
    });
})();