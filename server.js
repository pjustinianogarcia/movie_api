//require fuctions to import http, url,fs
const http = require('http'),
  fs = require('fs'),
  url = require('url');

//function from http module to create server
http.createServer((request, response) => {
  let addr = request.url,
    q = new URL(addr, 'http://' + request.headers.host),
    filePath = '';
//function to append date and time info to log.txt
    fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Added to log.');
      }
    });
  //conditional statement to check if the URL contains the word “documentation”
    if (q.pathname.includes('documentation')) {
      filePath = (__dirname + '/documentation.html');
    } else {
      filePath = 'index.html';
    }
  //function to catch error
    fs.readFile(filePath, (err, data) => {
      if (err) {
        throw err;
      }
  
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.write(data);
      response.end();
  
    });
  
  }).listen(8080);
  console.log('My test server is running on Port 8080.');