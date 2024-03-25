const path = require('path');
const moment = require('moment');
var dbConn= require('./dbConnection.js');

const bodyparser = require('body-parser');

const express = require('express');
const app = express();

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(express.static('public'));

app.listen(8080, () => {
    console.log(`Server is running on port 8080 `);
    
});


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/list', function(req, res) {
    res.sendFile(path.join(__dirname, '/list.html'));
});


// Lấy danh sách các đại biểu đã checked in 
app.get('/checked-in', function (req, res) {
    
    const now = moment(); // Lấy thời gian hiện tại
   //now.format('YYYY-MM-DD'))
    dbConn.query('SELECT d.id,b.userCode,avatar,welcomeMp3,fullName,organization,description , d.dateCheckin,d.reason,d.reasonCode FROM diemdanh d, daibieu b where d.userCode=b.userCode and DATE(d.dateCheckin)= ? ORDER BY d.dateCheckin asc',now.format('YYYY-MM-DD'),
     function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Thành công' });
    });
});

// Lấy danh sách các đại biểu đã checked in 
app.get('/checked-in-last/:id', function (req, res) {
    
    var id = parseInt(req.params.id);
    if(!Number.isInteger(id))
        return res.send({ error: true, data: null, message: 'Bad request' });
    
    const now = moment(); // Lấy thời gian hiện tại
   //now.format('YYYY-MM-DD'))
    dbConn.query('SELECT d.id,b.userCode,avatar,welcomeMp3,fullName,organization,description , d.dateCheckin,d.reason,d.reasonCode FROM diemdanh d, daibieu b where d.userCode=b.userCode and DATE(d.dateCheckin)= ? and d.id > ? ORDER BY d.dateCheckin asc limit 1',[now.format('YYYY-MM-DD'),id],
     function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Thành công' });
    });
});

app.get('/danh-sach-dai-bieu/:type', function (req, res) {
    
    const allowedType = [0, 1, 2];
    var type =parseInt(req.params.type);  
    if(!Number.isInteger(type))
        return res.send({ error: true, data: null, message: 'Bad request' });
    if(!allowedType.includes(type))
        return res.send({ error: true, data: [], message: 'Không tìm thấy dữ liệu' });

    dbConn.query('CALL vnfacethanhdoan.GetDaiBieu(?)',type, function (error, results, fields) {    
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Thành công' });
    });
});

//hook callback from vnface
app.post('/vnface-hook', function (req, res) {

   
    const apiKey = req.headers['api-key'];    
    if( apiKey != 'a61eacac344f511554280db79ac76c3a'){
        res.status(403).send('403 Forbidden: Access Denied');
        return;
    }    
    const now = moment(); // Lấy thời gian hiện tại
    var userCode=req.body.userCode;
    var imageUrl=req.body.imageUrl;
    var dateCheckin= req.body.dateCheckin;
    var reasonCode= req.body.reasonCode;
    var reason= req.body.reason;
    
    
    /* Cho diem danh nhieu lan
     dbConn.query('SELECT count(1) as counter from diemdanh where DATE(dateCheckin)= ? and  userCode= ?',[now.format('YYYY-MM-DD'),userCode],function (error, results, fields) {
     
        if (error) throw error;
    
    var isCheckedIn=results[0].counter;;       
    if(isCheckedIn > 0){
        console.log("The user has already checked in");
        return;
    }
    */
    const newCheckin = { id: 0, userCode: userCode, imageUrl: imageUrl,dateCheckin: moment(dateCheckin, 'DD/MM/YYYY HH:mm:ss').toDate(),reasonCode: reasonCode, reason:reason};
    dbConn.query('INSERT INTO diemdanh SET ?', newCheckin, (err, result) => {
        if (err) {
            console.error('Error inserting data: ', err);
            return res.send({ error: true, data: null, message: 'Không thành công' });
        }
        console.log('User checked in:' + userCode);
    });
        
    /*
    // Khong su dung socket
    //send to client
    dbConn.query('SELECT * from daibieu where userCode=?',userCode,function (error, results, fields) {        
        if (error) throw error;          
        wss.clients.forEach(function each(client) {
            client.send(JSON.stringify(results[0]));
        });
    });
    */

   
    return res.send({ error: false, data: userCode, message: 'Thành công' });

});


/*
Khong su dung socket

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    // Handle WebSocket messages
    ws.on('message', (message) => {
      console.log(`Received message: ${message}`);
      // Echo the message back to the client
      ws.send(`Echo: ${message}`);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    wss.on('error', console.error);
});
 
*/
 




