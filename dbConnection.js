var mysql=require('mysql');
var connection=mysql.createPool({
 
host:'10.21.30.228',
 user:'root',
 password:'Vnptbg12!',
 database:'vnfacethanhdoan'
 
});
module.exports=connection;