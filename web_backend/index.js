'use strict';

var fs = require('fs');

var express = require("express");
var session = require('express-session')
var compression = require('compression');
// var serve_static = require('serve-static');
var cookieParser = require('cookie-parser');
var path = require('path');
var app = express();
var http= require('http').Server(app);
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
var serverPort = 8080;
var enterpriseClientIp = "http://39.104.175.115:8000", bankClientIp = "http://39.104.175.115:9000";
app.use(compression());
app.use(cookieParser());
app.use(session({ secret: 'Plume@Fabric', resave: true, saveUninitialized: true }));
app.all('*', function(req, res, next) {  
//    if( req.headers.origin == enterpriseClientIp || req.headers.origin == bankClientIp )
    {
        res.header("Access-Control-Allow-Origin", req.headers.origin);  
        res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");  
        res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
        res.header('Access-Control-Allow-Credentials', true) ;
        res.header("X-Powered-By",' 3.2.1');
    }
    // res.header("Content-Type", "application/json;charset=utf-8");  
    if (req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});  

// swaggerRouter configuration
var options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  // Start the server
  http.listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
  });

});
//For all api call, please login first.
app.use(function(req,res,next){
    if(req.originalUrl.startsWith("/api/")&& req.originalUrl!="/api/user/login"){
    if(req.session.username){
        next();
    }
    else{
        res.status(401).end("Please login first");
    }
} else{ next();}
});
