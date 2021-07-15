'use strict';
var express = require('express');
var router = express.Router();

const path = require('path');
var fs = require('fs');

var url = require('url');

/* GET home page. */
router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../views/home.html'));
});

router.get('/getWeather', function (req, res) {
    const queryObject = url.parse(req.url, true).query;

    var city = queryObject.city;

    var found = false;
    var weather = "";
    var dataWeather = fs.readFileSync('WeatherData.json', 'utf8');
    var dataRows = JSON.parse(dataWeather);
    dataRows.forEach(function (row) {
        console.log(row);
        var cityW = row.city;
        if (city.trim().toLowerCase() == cityW.trim().toLowerCase()) {
            found = true;
            weather = row.weather;
        }
    });

    if (found) {
        res.send("<html><body><center><br><h4>City " + city + " Weather : " + weather + "</h4><br><a href='/'>Back</a></center></body></html>");
    } else {
        res.send("<html><body><center><br><h6>City Weather Not Found. <br> You can add city.</h6><br><a href='/addCity'>Add City</a></center></body></html>");
    }
});

router.get('/updateCity', function (req, res) {
    res.sendFile(path.join(__dirname, '../views/updateCity.html'));
});

router.post('/updateCity', function (req, res) {
    var city = req.body.city.trim();
    var weather = req.body.weather.trim();

    var dataWeather = fs.readFileSync('WeatherData.json', 'utf8');
    var dataRows = JSON.parse(dataWeather);
    dataRows.forEach(function (row, key) {
        console.log(row);
        var cityW = row.city;
        if (city.trim().toLowerCase() == cityW.trim().toLowerCase()) {
            dataRows[key].city = city;
            dataRows[key].weather = weather;
        }
    });

    // Writing to our JSON file
    var newDataF = JSON.stringify(dataRows);
    console.log(newDataF);
    fs.writeFile("WeatherData.json", newDataF, (err) => {
        // Error checking
        if (err) throw err;
        console.log("New data updated");
        res.redirect('/');
    });
});

router.post('/addCity', function (req, res) {
    var city = req.body.city.trim();
    var weather = req.body.weather.trim();

    // Storing the JSON format data in myObject
    var data = fs.readFileSync("WeatherData.json");
    var weatherObject = JSON.parse(data);

    // Defining new data to be added
    let newData = {
        city: city,
        weather: weather
    };

    // Adding the new data to our object
    weatherObject.push(newData);

    // Writing to our JSON file
    var newDataF = JSON.stringify(weatherObject);
    console.log(newDataF);
    fs.writeFile("WeatherData.json", newDataF, (err) => {
        // Error checking
        if (err) throw err;
        console.log("New data added");
        res.redirect('/');
    });
});

router.get('/displayAllWeather', function (req, res) {
    var html = '';
    var dataWeather = fs.readFileSync('WeatherData.json', 'utf8');
    var dataRows = JSON.parse(dataWeather);
    dataRows.forEach(function (row) {
        html += "<p>City <b>" + row.city + "</b> Weather : " + row.weather + "</p>";
    });
    res.send("<html><body><center><h2>All City Weather</h2><br><a href='/'>Home</a><br>" + html + "</center></body></html>");
});

module.exports = router;
