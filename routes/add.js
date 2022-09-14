var express = require("express");
var router = express.Router();
const MongoClient = require("mongodb").MongoClient;

const gjv = require("geojson-validation");
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
  res.render("add", { title: "mountain hinzufügen" });
});

/**
 * POST Befehl
 */
router.post("/mapmarker", function (req, res, next) {

  // Überprüfung auf Fehler
  if (req.body.mountain == "" || req.body.altitude == "" || req.body.long == "" || req.body.lat == "") {
    res.render("notification", {
      title: "Inkorrekte Eingabe! Erneut Versuchen!",
    });
  } else {

    getWikipediaUrl(req.body.url);

      setTimeout(function () {
      // Definieren des Features
      let mountain = {
        "type": "Feature",
        "properties": {
          "shape": "Marker",
          "name": req.body.mountain,
          "altitude": req.body.altitude,
          "url": req.body.url,
          "description": description
        },
        "geometry": {
          "type": "Point",
          "coordinates": [req.body.long, req.body.lat]
        },
      };
      
      mountain.properties.description = description;

      addNewMountaintoDB(client, dbName, collectionName, mountain, res);
    }, 1500);
  }
});

/**
 * POST Befehl für ein hinzugefügtes mountain im GeoJSON Format
 */
router.post("/textinput", function (req, res, next) {

  try {
    JSON.parse(req.body.textinput);
  }
  catch (err) {
    res.render("notification", {
      title: "Inkorrekte Eingabe! Bitte an das gegebene Format halten!",
    });
  }
  let mountain = JSON.parse(req.body.textinput);

    getWikipediaUrl(mountain.properties.url);

    // Hier wird mit Timeout gearbeitet, damit die Beschreibung gegeben ist
    setTimeout(function () {
      mountain.properties.description = description;

      addNewMountaintoDB(client, dbName, collectionName, mountain, res);
    }, 1500);
});


/**
 * addNewMountaintoDB
 * @description Abrufen der Elemente aus der Datenbank. Anschließend werden diese als Input Daten weitergegeben.
 * @param {*} client 
 * @param {*} dbName 
 * @param {*} collectionName 
 * @param {*} mountain 
 * @param {*} res 
 * @source: https://github.com/aurioldegbelo/geosoft2022/blob/main/lecture%2008/scenario%20(express%20%2B%20mongodb)/routes/add.js
 */
 function addNewMountaintoDB(client, dbName, collectionName, mountain, res) 
 {
   client.connect(function (err) {
     console.log("Connected successfully to server");
 
     // Abrufen der Datenbank
     const db = client.db(dbName);
     const collection = db.collection(collectionName);
 
     // Einfügen in die Datenbank
     collection.insertOne(mountain) // siehe https://www.mongodb.com/docs/drivers/node/current/usage-examples/insertOne/
     console.log("New Mountain inserted in the database");
     res.render("notification", { title: "mountain hinzugefügt!", data: JSON.stringify(mountain) });
   });
 }

/**
 * Überprüft die Gültigkeit eines Javascript String als URL 
 * https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
 * @param {*} string zu überprüfende URL
 */
 function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

/**
 * Überprüft die Gültigkeit einer URL
 * @param {*} url 
 */
function getWikipediaUrl(url) {
  // Überprüfung auf richtige URL und auf Wikipedia URL
  if (!isValidHttpUrl(url) || url.indexOf("wikipedia") === -1) {
    description = "Falscher Link wurde eingefügt";

  } else {
    let urlArray = url.split("/");
    let title = urlArray[urlArray.length - 1];
    
    // mit hilfe von: https://www.youtube.com/watch?v=yqwHxAH1xrw
    axios.get(
      "https://de.wikipedia.org/w/api.php?format=json&exintro=1&action=query&prop=extracts&explaintext=1&exsentences=1&origin=*&titles=" + title
    ).then(function (response) {
      const pageKey = Object.keys(response.data.query.pages)[0];
      description = response.data.query.pages[pageKey].extract;
    });
  }
}


/**
 * Überprüft die Gültigkeit eines Javascript String als URL  
 * https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
 * @param {*} string als zu überprüfende URL
 */
 function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

module.exports = router;