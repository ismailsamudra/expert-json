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
use first await go.get();
```
go.where([["status",true]]);
```
```
go.where([["status","=",true]]);
```
```
go.where([["status","!=",true]]);
```
```
go.where([["status",">",100]]);
```
```
go.where([["status",">=",100]]);
```
```
go.where([["status","<",100]]);
```
```
go.where([["status","<=",100]]);
```
- LIMIT
* use first await go.get();
```
go.limit(10);
```
- ORDERBY
** use first await go.get();
```
go.orderBy("id","DESC");
```
- OFFSET
### use first await go.get();
#### // var limit = 10;
// var page = 1;
// var index = (page-1)*limit;
```
go.offset(index,limit);
```
- LIKE / REGEX
use first await go.get();
```
go.regex("search value");
```
  
