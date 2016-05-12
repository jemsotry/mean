'use strict';

/**
 * Module dependencies.
 */
var app = require('./config/lib/app');
var server = app.start();

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

//server.listen(server_port, server_ip_address, function(){
  //console.log("Listening on " + server_ip_address + ", server_port " + server_port);});

var mean = require('meanio');

// Creates and serves mean application
mean.serve({ /*options placeholder*/ }, function(app, config) {
  console.log('Mean app started on port ' + config.http.port + ' (' + process.env.NODE_ENV + ')');
  if(config.https && config.https.port){
    console.log('Mean secure app started on port ' + config.https.port + ' (' + process.env.NODE_ENV + ')');
  }
});