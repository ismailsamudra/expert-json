<div align='center'>
   <img width=80px src='https://github.com/ismailsamudra/expert-json/assets/67509798/1719ed9e-1bb8-4b75-906c-ed92296fdeaf'>
 <h3>
    Expert Json @v.1.0.2
 </h3>
</div>

<hr>

## Dependency
- NPM URL : [https://www.npmjs.com/package/expert-json](https://www.npmjs.com/package/expert-json)
- Instal dependency NPM :
```
npm i expert-json
```

<hr>

## KETERANGAN.
- Expert Json adalah Librari basis nodejs di peruntukkan untuk Crud query Database dalam bentuk JSON file
- perintah di desain hampir sama dengan query ke MYSQL hingga mempermudah kita
- untuk mengelolah data JSON apabila terbiasa dengan query MYSQL

## CARA PAKAI
- INISIASI CRUD

```
const {Expert} = require('expert-json');
```
```
const go = new Expert("./db/log.json");
```
- GET ALL DATA ASYNC
```
await go.get();
```
- GET DATA PARSING ASYNC [where,limit,LIKE]
```
await go.get(["status",true],1,"search value");
```
- WHERE
<br> use after await go.get();
```
go.where(["status",true]);
```
```
go.where(["status","=",true]);
```
```
go.where(["status","!=",true]);
```
```
go.where(["status",">",100]);
```
```
go.where(["status",">=",100]);
```
```
go.where(["status","<",100]);
```
```
go.where(["status","<=",100]);
```
- LIMIT
<br> use after await go.get();
```
go.limit(10);
```
- ORDERBY
<br> use after await go.get();
```
go.orderBy("id","DESC");
```
- OFFSET
<br> use after await go.get();
<br> // var limit = 10;
<br> // var page = 1;
<br> // var index = (page-1)*limit;
```
go.offset(index,limit);
```
- LIKE / REGEX
<br> use after await go.get();
```
go.regex("search value");
```
## ASYNC FUNCTION CRUD
- FIND
```
await go.find({id:1});
```
- FIND-ONE
```
await go.findOne({id:1});
```
- INSERT
```
await go.insert({id:1,name:"ismail samudra"});
```
- UPDATE
```
await go.update({id:1},{name:"Ubaid Fawaz Fatih"});
```
- REMOVE / DELETE
```
await go.remove({id:1});
```
## OTHER FUNCTION
- INISIASI
```
Use const {Expert,ExpertDb,xFile,dFile,isNum} = require('expert-json');
```
- CREATE FILE DB JSON
```
ExpertDb("dir/jsonName");
```
- CREATE FILE OR DIR dinamis link
  
<br><small> ONLY DIR </small>
```
xFile("./dir1/dir2");
```
<br><small> DINAMIS FILE </small>
```
xFile("./dir1/dir2/log.txt");
```
- DELETE FILE OR DIR dinamis link
```
xFile("./dir1/dir2/log.txt","DELETE");
```
- CEK STRING IS NUMBER OR NOT
```
return isNum("123");
```

## EXAMPLE CODE GET DATA
```
const {Expert} = require('expert-json');
const go = new Expert("./db/log.json");
async function getData(){
   var limit = 5;
   var page = 1;
   var index = (page-1)*limit;
   await go.get();
   go.orderBy("id","DESC");
   return go.offset(index,limit);
}
```
## EXAMPLE CODE INSERT DATA
```
const {Expert} = require('expert-json');
const go = new Expert("./db/log.json");
// var document = {name:"Ismail Samudra",level:"develope"};
async function insert(document){
   return await go.insert(document);
}
```


  
