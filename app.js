var PouchDB = require("pouchdb");
var express = require("express");
var app = express();
require("dotenv").config();

app.use("/", require("express-pouchdb")(PouchDB));

app.listen(process.env.PORT);
