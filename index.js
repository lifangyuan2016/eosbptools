var http = require('http');
var fs = require('fs');
var dataPath = './outfile';
var spawn = require('child_process').spawn
http.createServer((req,res)=>{
    res.end(fs.readFileSync(dataPath).toString('utf8'));
}).listen(80)

setInterval(function(){
    var ls = spawn('node',['./bp_info.js'])
},60000*1)
