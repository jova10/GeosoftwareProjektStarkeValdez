var express = require("express");
var router = express.Router();
const MongoClient = require("mongodb").MongoClient;

var mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const axios = require("axios");

const url = "mongodb://127.0.0.1:27017"; // connection URL
const client = new MongoClient(url); // mongodb client
const dbName = "mydatabase"; // database name
const collectionName = "mountain"; // collection name
let description = "";

/**
 * GET Befehl
 */
router.get("/", function (req, res, next) {
  retrieveAllMountainsfromDB(client, dbName, collectionName, res)
});

// Erlangt alle Elemente aus der Datenbank, die dann als Ergebnis zum Bearbeiten weitergegeben werden.
// Quelle: https://github.com/aurioldegbelo/geosoft2022/blob/main/lecture%2009/scenario%20as%20a%20docker%20app/routes/search.js
async function retrieveAllMountainsfromDB(client, dbName, collectionName, res) 
{

  await client.connect()
  console.log('Connected successfully to the database')

  const db = client.db(dbName)
  const collection = db.collection(collectionName)

  const cursor =  collection.find({})
  const results = await cursor.toArray(function (err, docs) {
  // Gibt die Daten aus dem Ergebnis als Input fürs Bearbeiten weiter
  res.render('delete', { title: 'Gebirge löschen', data: docs });

})
}

// Ausgewählte Gebirge löschen
router.post("/deleteOne", function (req, res, next) {

  var mountainID = req.body.id;

  // Überprüft ob ein Gebirge ausgewält wurde
  if (mountainID == "") {
    res.render("notification", {
      title: "Keine Eingabe erhalten!",
    });
  } else {
    deleteMountainsfromDB(req, client, dbName, collectionName, res)
  }
});

// Quelle: https://www.mongodbtutorial.org/mongodb-crud/mongodb-deleteone/
async function deleteMountainsfromDB(req, client, dbName, collectionName, res) {

  await client.connect()
  console.log('Connected successfully to the database')
  
  const db = client.db(dbName)
  const collection = db.collection(collectionName)

  var mountainID = req.body.id;

  const cursor =  collection.find({ _id: ObjectId(mountainID) })
  const results = await cursor.toArray(function (err, docs) {
    if (docs.length >= 1) {
      collection.deleteOne({ _id: ObjectId(mountainID) }, function (err, results) {
      });
      res.render("notification", {
        title: "Gebirge gelöscht!",
      });
    } 
  })
}

module.exports = router;