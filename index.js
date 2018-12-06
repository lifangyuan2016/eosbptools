var http = require('http');
var fs = require('fs');
var dataPath = './outfile';
var spawn = require('child_process').spawn
var URL = require('url');
process.title='bpinfo';
http.createServer((req,res)=>{
    let path = URL.parse(req.url);
    switch(path.pathname){
        case '/':
            res.end(fs.readFileSync(dataPath).toString('utf8'));
        break;
        default:
            res.end('default');
    }
}).listen(4000)

setInterval(function(){
    var ls = spawn('node',['./bp_info.js'])
},60000*1)
