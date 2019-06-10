var http = require('http'),
  bodyParser = require('body-parser'),
  express = require('express'),
  fs = require('fs'),
  path = require('path'),
  cors = require('cors');
var PORT = 8080;

var server  = http.createServer(),
app = express(server);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cors());
var fileJSON = 'data.json';


app.post('/',function(req, res){
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Content-Type', 'application/json');

  //express.static(path.join(__dirname, '../public')))
  //app.use('/static', express.static( path.join(__dirname + '../public')));
  fs.readFile(fileJSON, 'utf8', function(err, data){
    if(err){
      console.log(err);
    }else{
      var dataJSONparse = JSON.parse(data);
      res.send(dataJSONparse);
    }
  });
});
app.listen(PORT, function(){
  console.log('Server is listening on port: ' + PORT);
});
/*
module.exports={
  getData: function(dataType){
    fs.readFile(ruta, 'utf8', function(err, readData){
      if(err) reject(err);
      resolve(JSON.parse(readData));
    });
  }
}*/
