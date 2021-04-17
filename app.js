const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require("body-parser");
const urlParser = bodyParser.urlencoded({extended: false});
const app = express();

const file_json = 'client.json';
function getObj(ip, port, data) {
    return {
        ip: ip,
        port: port,
        Time: `${data.getDay()}.${data.getMonth()}.${data.getFullYear()}. ${data.getHours()}:${data.getMinutes()}`
    }
}
app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.post('/answer', urlParser, (req, res) => {
   try {
    let ad = req.connection.address();
    console.log(ad);
    fs.readFile(path.join(__dirname,file_json),"utf-8",(err,data)=>{
        if(err){
            throw new Error('error with read File '+err);
        }
        let array =  JSON.parse(data);
        console.log(array);
        array.push(getObj(ad['address']=='::1'?'127.0.0.1':ad['address'], ad['port'], new Date()));
        fs.writeFile(path.join(__dirname,file_json),JSON.stringify(array),(err)=>{
            if(err){
                throw new Error('error with write file '+err)
            }
            console.log('obj was writing');
        })
    });
   } catch (error) {
       console.log(console.error());
   }
    res.redirect('/');
});
app.listen(process.env.PORT || 8080, () => {
    console.log('server has been started...', 8080);
});
