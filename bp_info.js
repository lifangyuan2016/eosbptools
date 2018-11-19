var table = require("table");
var EventProxy = require('eventproxy')
var async = require('async');
var data = require('./data');
var request = require('request');
var colors =require('colors');
var count = 1;
var txid = "321b39934982b77892e2c7b80864ff791cb19f8adf3a8fa337da069c3ad0f0f4"
var ep = new EventProxy();
var fs = require('fs')
ep.after('done',data.nodelist.length,function(tr){
    tr = tr.filter(function(item){
        return item[2] == String(200)
    })
    tr.sort(function(a,b){
        return a[3]-b[3]
    })
    tr = tr.map(function(item){
        //return [item[0],item[1],item[2],transformTime(item[3])]
        return [item[0],item[1].replace("/v1/history/get_transaction",""),item[2],item[3].toFixed(2)]
    })

    tr.unshift(["","URL","Response Code","Times ms"]);
    tr.push(["","","Update:",new Date().toLocaleString()]);
    //console.log(table.table(tr,{border:table.getBorderCharacters('norc')}));
    let outFile = table.table(tr,{border:table.getBorderCharacters('void')});
    fs.writeFile('./outfile',outFile,err=>null)
})

function req(url,txid,callback){
    var opt = {
        time:true,
        method:'POST',
        json:true,
        body:{id:txid},
        timeout:1000*30
    }
    opt.url = url + "/v1/history/get_transaction";
    request(opt,cb);

    function cb(err,res,body){
        callback(null,null)
        if(err){
            count++;
            ep.emit('done',[count,(err.hostname||err.host)+":"+err.port,err.code,0]);
        }else{
            let url = res.request.href;
            let statusCode;
            if(res.statusCode === 200){
                statusCode = String(res.statusCode)
                //console.log(`${url} Status:`,"OK".bold.green,"Times:",res.timings.end.toFixed(2).green,"ms");
            }else{
                statusCode = String(res.statusCode)
                //console.log(`${url} is `,"UNAVAILABLE".bold.red);
            }
            let tr = [
                count,
                url,
                statusCode,
                res.timings.end,
            ]
            count++;
            ep.emit('done',tr);
        }
    }
}
async.mapLimit(data.nodelist,15,function (item, callback) {
    req(item,txid,callback);
}, function (err, result) {
});

function transformTime(code){
    code = code.toFixed(2)
    if(code<=200){
        return code.bold.green
    }else if(code>200 && code <=500){
        return code.bold.yellow
    }else{
        return code.red.bold
    }
}
