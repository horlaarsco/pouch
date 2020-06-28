var PouchDB = require("pouchdb");
var express = require("express");
var app = express();
var cors = require("cors");

require("dotenv").config();
app.use(cors());

app.use("/", require("express-pouchdb")(PouchDB));

app.listen(process.env.PORT);
