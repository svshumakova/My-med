"use strict";

let dbStr = process.env.MARIADB_URL || process.env.MYSQL_URL;
let config = {
  db: process.env.MARIADB_URL || process.env.MYSQL_URL || "mysql://root@localhost/med",
  port : process.env.PORT || 3000,
  secret: "svetas-secret"
};


module.exports = config;