"use strict";

const mysql = require('mysql');
const fs = require('fs');
const exec = require('child_process').exec;
const path = require('path');
const debug = require('debug')("media-convert");

const convertedDir = "\\converted\\";

const convertQueue = [];

const statuses = {
  converted: 2,
  inprogress:1,
  unconverted:0
};


var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'med'
});


connection.connect(function(err) {
  if (err) {
    debug('error connecting: ' + err.stack);
    return;
  } else {
    debug('connected as id ' + connection.threadId);
  }
});

// NULL - not converting
// 1 - In progress
// 2 - Done

connection.query('SELECT * FROM Media WHERE (status=1) OR (status is NULL)', function (err, rows) {
  if (err){
    debug('error connecting: ' + err.stack);
    return;
  }

  debug('select all unconverted videos from db', rows);

  rows.forEach(function(mediaObj){
    convertQueue.push({
      id: mediaObj.id,
      file: mediaObj.file,
      name: mediaObj.name
    });
  });

  debug('get convertation queue', convertQueue);

  convertVideos(convertQueue);

});

/*Copying*/
function convertVideos(queue){
  if(!queue.length){
    debug(`no new files to convert`);
    return;
  }
  console.log("copy " + queue[0].file + "\" \"" + __dirname + convertedDir + "\"");

  const copy = exec("copy " + queue[0].file + "\" \"" + __dirname + convertedDir + "\"");
  /*changeStatus(statuses.inprogress, queue[0]);
  debug(`start converting ${queue[0]}`);

  setTimeout(function(){

    changeStatus(statuses.converted, queue[0]);
    debug(`end converting ${queue[0]}`);
    queue.shift();

    convertVideos(queue);

  }, 5000);*/
}

/* Simple async fn
function convertVideos(queue){
  if(!queue.length){
    debug(`no new files to convert`);
    return;
  }

  changeStatus(statuses.inprogress, queue[0]);
  debug(`start converting ${queue[0]}`);

  setTimeout(function(){

    changeStatus(statuses.converted, queue[0]);
    debug(`end converting ${queue[0]}`);
    queue.shift();

    convertVideos(queue);

  }, 5000);
}*/

function changeStatus(status, id) {

  connection.query(`UPDATE Media SET status=${status} WHERE id=${id}`, function(err, result){
    if(err) throw err;

    debug(`status updated in db: id=${id}, new status=${status}`);
  });
}