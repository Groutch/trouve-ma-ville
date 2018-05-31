//utilisation d'express
let app = require("express")();
//utilsation de request
let request = require("request");
//utilisation de moment
let moment = require('moment');
//definition du moteur de template: ejs
app.set('view engine', 'ejs');
//meteo à toulouse
let requestURL1 = "https://api.openweathermap.org/data/2.5/weather?q=Toulouse&lang=fr&appid=795ad87e41aee9a5599867be599bf944";
//distance stgo tlse
let requestURL3 = "https://www.mapquestapi.com/directions/v2/route?key=wK2LGyYk3ShfqSXZ0iiw0ah2epQGwfFX&from=Toulouse%2C+FR&to=Saint-Gaudens%2C+FR&outFormat=json&ambiguities=ignore&routeType=fastest&doReverseGeocode=false&enhancedNarrative=false&avoidTimedConditions=false";
//definition de ce qu'il se passe lorsqu'on accede à la racine du serveur (/)
app.get('/', function (req, response) {
    //on récupère l'heure via moment.js
    let timeThere = moment();
    timeThere.locale('fr');
    timeThere = timeThere.format("H:mm:ss"); 
    request(requestURL1, {json: true}, function (err, res, body1) {
        if (err) {
            return console.log(err);
        }
        request(requestURL3, {json: true}, function (err, res, body3) {
            if (err) {
                return console.log(err);
            }
            //body1:Meteo Tlse
            //body3:distance stgo-tlse
            //rendu du template index.ejs avec envoie des differents paramètres
            response.render('index', {
                time: "Heure : " + timeThere,
                name: body1.name,
                long: "Longitude:" + body1.coord.lon,
                lat: "Latitude:" + body1.coord.lat,
                weather: "Météo : " + Number(body1.main.temp - 273.15) + "°C" + "\n " + body1.weather[0].description,
                stgoll: " Longitude: " + body3.route.locations[1].displayLatLng.lng + " Latitude: " + body3.route.locations[1].displayLatLng.lat,
                dist: "Distance entre Toulouse et Saint-Gaudens : " + Number(body3.route.distance*1.609344).toFixed(2)+"km"
            });
        });

    });
});

//lancement du serveur sur le port 8080
app.listen(8080);
