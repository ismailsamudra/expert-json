// 'use strict';
const fs = require("fs");
const REQ = require('./JsonRegex');
/**
 * AUTOR        : ISMAIL SAMUDRA
 * CONTACT      : 083136245050
 * TIME RELEASE : 11-06-2024.
*/
class Expert {
    constructor(jsonName,schema = {}) {
        this.filePath = "././db/"+jsonName+".json";
        xFile(this.filePath);
        this.data = require(__dirname+"/../db/"+jsonName+".json");
        this.indexes = {};
        this.schema = schema;
        this.isLoaded = false;
        this.dt = [];
      }
      load(){

      }
   async load2(){
        try {
            const data = fs.readFile(this.filePath, "utf-8");
            this.data = JSON.parse(data);
            this.isLoaded = true;
          } catch (e) {
            if (e.code === "ENOENT") {
              this.data = {};
              this.isLoaded = true;
              await this.save();
            } else {
              throw new Error(
                `Failed to load data from ${this.filePath}: ${e.message}`
              );
            }
          }
    }
    get(where,limit,rx){   
        var dt = [];  
        for(var i in this.data){
            dt.push(this.data[i]);
        }
        this.data=dt;
        if(where){
           dt = this.where(where);
        }
        if(limit){
          dt = this.limit(limit);
        }
        if(rx){
          dt = this.regex(rx);
        }
       return dt;
    }
    offset(top,left){
        var dt = [];  
        for(var i in this.data){
            dt.push(this.data[i]);
        }
        this.data=dt;
        dt = [];
        var N = top;
        while(N<(left+top)){
            if(this.data[N]){
                dt.push(this.data[N]);
            }
            N++;
        }
        this.data = dt;
        return dt;
    }
    orderBy(id,val){
        var act = val.toLowerCase();
        var dt = this.data;
        if(act=="desc"){
            return dt.sort((a,b) => {
                if ( b[id] < a[id]) {
                    return -1;
                }
            });
        }else{
            return dt.sort((a,b) => {
                if ( b[id] < a[id]) {
                    return +1;
                }
            });
        }
    }
    regex(val){
        var dt = [];
        const rege = REQ.search(val, this.data,{details: true});
        for(var reg in rege){
            var k = rege[reg]['path'];
            if(k.length>1){
                if(this.data[k[0]]){
                    dt.push(this.data[k[0]]);
                }
            }
        }
        dt = Array.from(new Set(dt.map(JSON.stringify)))
               .map(JSON.parse);
        this.data=dt;
        return dt;
    }
    limit(limit){
        var dt = [];var N = 0;
        while(N<limit){
            if(this.data[N]){
                dt.push(this.data[N])
            }
        N++;
        }
        this.data=dt;
        return dt;
    }
    // var wr =["status","=",false];
    where(where){
       var dt = [];
        for(var i in this.data){
            if(this.wr(where,this.data[i])){
                dt.push(this.data[i]);
            }
        }
        this.data=dt;
        return dt;
    }
    wr(where,dt){
        try {
            if(where.length==3){
                var act = where[1].toLowerCase();
                    switch (act) {
                        case "=": return (dt[where[0]]==where[2])?true:false;
                        case "!=": return (dt[where[0]]!=where[2])?true:false;
                        case ">": return (dt[where[0]]>where[2])?true:false;
                        case ">=": return (dt[where[0]]>=where[2])?true:false;
                        case "<": return (dt[where[0]])?((dt[where[0]]<where[2])?true:false):false;
                        case "<=": return (dt[where[0]])?((dt[where[0]]<=where[2])?true:false):false;
                        default: return false
                    }
            }else if(where.length==2){
                return (dt[where[0]]==where[1])?true:false;
            }else{return false;}
        } catch (e){return false;}
    }
}
function ExpertDb(name,del){
     if(!del){
        xFile("././db/"+name+".json");
    }else{
        dFile("././db/"+name+".json");
     }
}
function isNum(num){
    console.log(/^\d+$/.test(num));
    return /^\d+$/.test(num);
}
function xFile(path,data="{}"){
    let root = '././';
    var e = path.split('/')
    if(e.length>1){
        for(var i=0;i<e.length;i++){
            if(e[i].split('.').length>1){
                cFile(root+e[i],data);
            }else{
                cDir(root+e[i]);
                root += e[i]+'/';
            }
        }
        return true;
    }else{
        var x = e[0].split('.')
        if(x.length>1){
            return cFile(root+e[0],data);
        }else{
            return cDir(root+e[0]);
        }
    }
}
function dFile(path){ 
    var pat = '././'+path;
    if (fs.existsSync(pat)){
        if(fs.lstatSync(pat).isDirectory()){
            fs.rmSync(pat, { recursive: true, force: true });
        }else{
            fs.unlinkSync(pat)
        }
        return true
    }else{
        return false
    }
}
function cDir(path){
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, 744);
        return true
    }
    return false
}
function cFile(path,data){
    if (!fs.existsSync(path)) {
        var stream = fs.createWriteStream(path);
        stream.once('open', function(){
        stream.write(data);
        stream.end();
        });
        return true;
    }
    return false;
}
module.exports = {Expert,ExpertDb,xFile,dFile,isNum};