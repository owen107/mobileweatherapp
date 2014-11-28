var icons = { "clear-day" : "B",
                     "clear-night" : "C",
                     "rain" : "R",
                     "snow" : "G",
                     "sleet" : "X",
                     "wind" : "S",
                     "fog" : "N",
                     "cloudy" : "Y",
                     "partly-cloudy-day" : "H",
                     "partly-cloudy-night" : "I"
       };

       var cities = {
                       "new york"  : {coords: {latitude: 40.672060, longitude:-73.983898}},
                       "los angeles"  : {coords: {latitude: 34.101422, longitude:-118.341224}},
                       "chicago"  : {coords: {latitude: 41.879003, longitude:-87.63675}},
                       "san francisco"  : {coords: {latitude: 37.788531, longitude:-122.407237}},
                       "miami"  : {coords: {latitude: 25.790176, longitude:-80.140133}},
                       "ann arbor"  : {coords: {latitude: 42.287158, longitude:-83.719016}},
                       "seattle"  : {coords: {latitude: 47.657453, longitude:-122.316437}},
                       "current location" : ""
       };


       function loadweather(cityCoords){
           
           var latlng = cityCoords.coords.latitude + "," + cityCoords.coords.longitude;

           var forecastURL = "https://api.forecast.io/forecast/9e9f12813a63c5ad1a19bacd10e776ad/"+latlng;

           $.ajax({
              url: forecastURL,
              jsonpCallback: 'jsonpCallback',
              contentType: "application/json",
              dataType: 'jsonp',
              success: function(json) {
                console.log(json);
                console.log(json.hourly.data.length);
                $("#current_temp").html(Math.round(json.currently.temperature)+"&#176;F");
                $("#current_summary").html(json.currently.summary);
                $("#current_temp").attr("data-icon", icons[json.currently.icon]);
              },
              error: function(json) {
                console.log(e.message);
              }
           });

       }


       function loadCity(city){
          $("#location").html(city);

          if (city.toLowerCase() == "current location") {
             if (navigator.geolocation) 
                  navigator.geolocation.getCurrentPosition(loadweather,loadDefaultCity);
             else {
                  loadDefaultCity();
             }
          } else {
             loadweather(cities[city.toLowerCase()]);
          }
       }

       function loadDefaultCity(){
             loadCity("Seattle");
       }


       $(document).ready(function(){
            loadCity("Seattle");

            $("a.city").bind("click", function(){
                   loadCity($(this).html());
            });
       });