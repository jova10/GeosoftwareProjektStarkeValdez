var express = require("express");
var router = express.Router();
const MongoClient = require("mongodb").MongoClient;

const url = "mongodb://127.0.0.1:27017"; // connection URL
const client = new MongoClient(url, { useUnifiedTopology: true}); // mongodb client
const dbName = "mydatabase"; // database name
const collectionName = "mountain"; // collection name

router.get("/", function (req, res, next) {
  // Stellt die Verbindung zur Datenbank her und erlangt alle dokumente.
  client.connect(function (err) {
   const db = client.db(dbName);
    const collection = db.collection(collectionName);

    collection.find({}).toArray(function (err, docs) {
      console.log('Found the following records...');
      res.render('show', { title: 'Gebirge anzeigen', data: docs });

    })

  })
});


module.exports = router;
