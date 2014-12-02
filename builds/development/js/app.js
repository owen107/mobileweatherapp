// Create a javascript object that associates date icon with icon font 
var icons = { "clear-day" : "B",
              "clear-night" : "C",
              "rain" : "R",
              "snow" : "W",
              "SNOW" : "G",
              "sleet" : "X",
              "wind" : "S",
              "fog" : "N",
              "cloudy" : "Y",
              "partly-cloudy-day" : "H",
              "partly-cloudy-night" : "I"
}; 

// Create a javascript object that associates city name with their coordinates
var cities = {
               "new york"  : {coords: {latitude: 40.672060, longitude:-73.983898}},
               "los angeles"  : {coords: {latitude: 34.101422, longitude:-118.341224}},
               "chicago"  : {coords: {latitude: 41.879003, longitude:-87.63675}},
               "san francisco"  : {coords: {latitude: 37.788531, longitude:-122.407237}},
               "miami"  : {coords: {latitude: 25.790176, longitude:-80.140133}},
               "ann arbor"  : {coords: {latitude: 42.287158, longitude:-83.719016}},
               "seattle"  : {coords: {latitude: 47.657453, longitude:-122.316437}},
               "current location" : {coords: {latitude: "", longitude:""}}
}; 

// Load weather data with AJAX request
function loadweather(cityCoords, convert){
   
   var latlng = cityCoords.coords.latitude + "," + cityCoords.coords.longitude;
   var convTemp = convert;
   var forecastURL = "https://api.forecast.io/forecast/9e9f12813a63c5ad1a19bacd10e776ad/" + latlng;

   $.ajax({
      url: forecastURL,
      jsonpCallback: 'jsonpCallback',
      contentType: "application/json",
      dataType: 'jsonp',
      success: function(result) {
        currentWeather(result, convTemp);
        currentSpecific(result, convTemp);
        getDailyWeather(result, convTemp);
        dailyWeatherDetails(result, convTemp);
        getHourlyWeather(result, convTemp);
        console.log('AJAX success!');
      },
      error: function(e) {
        console.log(e.message);
      },
      complete: function(result) {

        $('#hide').hide(); // hide three days weather info when the AJAX request is complete
        
        // if show the weather info when the 8days label is highlighted
        if ($('#8days').hasClass('highlighted')) {
           $('#hide').show();
        }   
        console.log('AJAX complete!');
        console.log(cities);
      }
   });
}

// Get the data for current weather info
function currentWeather(data, convert) {
    var temp = Math.round(data.currently.temperature);
    if (convert) {
        temp = Math.round((temp - 32) * (5/9)) + "&#176;";
    } else {
        temp = temp + "&#176;";
    }
    $("#current_temp").html(temp);
    $("#current_summary").html(data.currently.summary);
    $("#current_temp").attr("data-icon", icons[data.currently.icon]);
    var minTemp = Math.round(data.daily.data[0].temperatureMin);
     if (convert) {
        minTemp = Math.round((minTemp - 32) * (5/9)) + "&#176;";
    } else {
        minTemp += "&#176;";
    }

    var maxTemp = Math.round(data.daily.data[0].temperatureMax);
    if (convert) {
        maxTemp = Math.round((maxTemp - 32) * (5/9)) + "&#176;";
    } else {
        maxTemp += "&#176;";
    }
    $('.fa-long-arrow-up').html(maxTemp);
    $('.fa-long-arrow-down').html(minTemp);

    var precipType = data.currently.precipType;
    var precipProb = Math.round(data.currently.precipProbability * 100);
    if (data.currently.hasOwnProperty("precipType")) {
        if (precipType === 'rain') {
          var rain = $('.pType').removeClass('icon').attr('data-icon', '');
          rain.addClass('fa fa-umbrella').html( precipProb + "%");
        } else {
          var snowType = $('.pType').removeClass('fa fa-umbrella').addClass('icon');
          snowType.attr("data-icon", icons['SNOW']);
        }
    } else {
        var rain = $('.pType').removeClass('icon').attr('data-icon', '');
        rain.addClass('fa fa-umbrella').html( precipProb + "%");
    }    
}

// Get particular data for current weather info
function currentSpecific(data, convert) {
    $('#current_humidity').find('span').html((data.currently.humidity * 100) + "%");
    $('#current_dewpoint').find('span').html(Math.round(data.currently.dewPoint) + "&#176;");
    $('#current_visibility').find('span').html(Math.round(data.currently.visibility) + " mi");
    $('#current_windspeed').find('span').html(Math.round(data.currently.windSpeed) + " mph");
    $('#current_pessure').find('span').html(Math.round(data.currently.pressure) + " mb");
    var temp = Math.round(data.currently.apparentTemperature);
    if (convert) {
        temp = Math.round((temp - 32) * (5/9)) + "&#176;";
    } else {
        temp = temp + "&#176;";
    }
    $('#feel_like').find('span').html(temp);
}

// UNIX time covert function
function timeConverter(UNIX_timestamp){
    var t = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var year = t.getFullYear();
    var month = months[t.getMonth()];
    var date = t.getDate();
    var day = days[t.getDay()];
    var hour = t.getHours();
    var min = t.getMinutes() < 10 ? '0' + t.getMinutes() : t.getMinutes();
    var sec = t.getSeconds() < 10 ? '0' + t.getSeconds() : t.getSeconds();
    var time = month + ' ' + date + ' ' + year + ' ' + day +  ' ' + hour + ':' + min + ':' + sec ;
    return time;
}

// Get the current time 
function getCurrentTime(data) {
    var t = new Date(data.currently.time * 1000);
    var curTime = convertHourMin(t);
    return curTime;
}

// Get the data for hourly weathr info
function getHourlyWeather(data, convert) {
     var result = data.hourly.data;
     var offset = data.offset;
     var con = convert;
     $('#hourly ul').html('');

     $.each(result, function(index) {
         
         var output = '<li>';
         var temp = Math.round(result[index].temperature);
         if (convert) {
             temp = Math.round((temp - 32) * (5/9)) + "&#176;";
         } else {
             temp = temp + "&#176;";
         }
         var icon_key = result[index].icon;     
         var t = new Date(result[index].time * 1000);
         var hour = convertHour(t, offset);
         if (index == 0) {
           output += '<span class="hour">Now</span>';
         } else {
           output += '<span class="hour">' + hour + '</span>';
         }
         output += '<span class="icon" data-icon="' + icons[icon_key] + '"></span>';
         output += '<span class="hour-temp temperature">' + temp + '</span></li>';
         $('#hourly ul').append(output);
     });
}

// Modified the hour
function convertHour(time, offset) {

     var hour = time.getHours();
     hour = hourModified(hour, offset);

     if (hour === 0) {
        hour = 12 + 'AM';
     }  else if ( hour > 0 && hour < 12) {
        hour += 'AM';
     }  else if ( hour === 12) {
        hour += 'PM'; 
     }  else {
        hour = (hour - 12) + 'PM';
     }
     return hour;
}

// Modified the hour via time zone offset
function hourModified(hour, offset) {
     if (offset === -6) {
         hour -= 1;
         if (hour === -1) {
            hour = 23;
         }
     } else if (offset === -7) {
         hour -= 2;
         if (hour === -1) {
            hour = 23;
         } else if (hour === -2) {
            hour = 22;
         }
     } else if (offset === -8) {
         hour -= 3;
         if (hour === -1) {
            hour = 23;
         } else if (hour === -2) {
            hour = 22;
         } else if (hour === -3) {
            hour = 21;
         }
     }
     return hour;
}

// Get the data for daily weather info
function getDailyWeather(data, convert) {

     var result = data.daily.data;
     var offset = data.offset;
     var $hide = $('<div id="hide"></div>');
     $('#daily ul').html('');
     
     $.each(result, function(index) {
         var output = '<li>';

         var minTemp = Math.round(result[index].temperatureMin);
         if (convert) {
             minTemp = Math.round((minTemp - 32) * (5/9));
         }

         var maxTemp = Math.round(result[index].temperatureMax);
         if (convert) {
             maxTemp = Math.round((maxTemp - 32) * (5/9));
         }

         var icon_key = result[index].icon;
         var t = new Date(result[index].time * 1000);
         var day;
         var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
         if (index == 0) {
            day = 'Today';
         } else {
            day = days[t.getDay()];
         }
         output += '<span class="dayofweek">' + day + '</span>';
         output += '<span class="icon" data-icon="' + icons[icon_key] + '"></span>';
         if (minTemp >= 0 && minTemp <= 9 && maxTemp > 9) {
            output += '<span class="maxMinTemp temperature">' + maxTemp + "&#176;" + '&nbsp;&nbsp;&nbsp;&nbsp;' + minTemp + "&#176;" + '</span></li>';
            console.log("weila1");
         } else if (minTemp >= 0 && minTemp <=9 && maxTemp >=0 && maxTemp <=9) {
            output += '<span class="maxMinTemp temperature">' + maxTemp + "&#176;" + '&nbsp;&nbsp;&nbsp;&nbsp;' + minTemp + "&#176;" + '</span></li>';
            console.log("weila2");
         } else {
            output += '<span class="maxMinTemp temperature">' + maxTemp + "&#176;" + '&nbsp;&nbsp;&nbsp;' + minTemp + "&#176;" + '</span></li>';
            console.log("weila3");
         }

         if(index < 5) {
            $('#daily ul').append(output);
         } else {
            $hide.append(output);
         }             
     });
     $('#daily ul').append($hide);
}

// Modifed the time
function convertHourMin(time, offset) {

     var hour = time.getHours();
     var min = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
     var hourMin = '';
     hour = hourModified(hour, offset);

     if (hour === 0 ) {
        hourMin = 12 + ':' + min + 'AM';
     }  else if ( hour > 0 && hour < 12) {
        hourMin = hour + ':' + min + 'AM';
     }  else if ( hour === 12) {
        hourMin = hour + ':' + min + 'PM'; 
     }  else {
        hourMin = (hour - 12) + ':' + min +  'PM';
     }
     return hourMin;
}

// Get the details daily data for extended forecast page 
function dailyWeatherDetails(data, convert) {
      var result = data.daily.data;
      var offset = data.offset;
      var element = $('#days_extended');
      element.html('');

      $.each(result, function(index) {
         
         var output = '<div class="details"><div class="group"><div class="day_info">';
         var srt = new Date(result[index].sunriseTime * 1000);
         var sst = new Date(result[index].sunsetTime * 1000);
         var minTempTime = new Date(result[index].temperatureMinTime * 1000);
         var maxTempTime = new Date(result[index].temperatureMaxTime * 1000);
         var t = new Date(result[index].time * 1000);

         var day;
         var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
         var months = ['January','Feburary','March','April','May','June','July','August','September','October','November','December'];

         if (index == 0) {
            day = 'Today';
         } else {
            day = days[t.getDay()];
         }
         var month = months[t.getMonth()];
         var date = t.getDate();
         var md = month + ' ' + date;
         
         var srhour = convertHourMin(srt, offset);
         var sshour = convertHourMin(sst, offset);
         var minTempHour = convertHour(minTempTime, offset);
         var maxTempHour = convertHour(maxTempTime, offset);

         var minTemp = Math.round(result[index].temperatureMin);
         if (convert) {
             minTemp = Math.round((minTemp - 32) * (5/9)) + "&#176;";
         } else {
             minTemp += "&#176;";
         }
         var maxTemp = Math.round(result[index].temperatureMax);
         if (convert) {
             maxTemp = Math.round((maxTemp - 32) * (5/9)) + "&#176;";
         } else {
             maxTemp += "&#176;";
         }
         var icon_key = result[index].icon;
         var dewPoint = Math.round(result[index].dewPoint) + "&#176;";
         var humidity = (result[index].humidity * 100) + "%";
         var visibility = result[index].visibility + "mi";
         var windSpeed = Math.round(result[index].windSpeed) + "mph";
         var pressure = Math.round(result[index].pressure) + "mb";
         var precipType = result[index].precipType;
         var precipProb = Math.round(result[index].precipProbability * 100) + '%';

         output += '<span id="weekday">' + day + '</sapn>';
         output += '<span id="date">' + md + '</span>';
         output +='</div><div class="sun_info"><ul><li><span class="icon" data-icon="J"></span>';
         output += '<span class="sunrise">' + srhour + '</span>';
         output += '</li><li><span class="icon" data-icon="K"></span>';
         output += '<span class="sunset">' + sshour + '</span>';
         output += '</li></ul></div></div><div class="more_details"><h1>Details</h1><div class="group"><div class="pattern">';
         output += '<h2 class="icon" data-icon="' + icons[icon_key] + '"></h2>';
         output += '</div><div class="specific"><ul>';
         output += '<li>Dew Point<span>' + dewPoint + '</span></li>';
         output += '<li>Humidity <span>' + humidity + '</span></li>';

         if (result[index].hasOwnProperty("visibility")) {
            output += '<li>Visibility <span>' + visibility + '</span></li>';
         } else {
            output += '<li>Pressure<span>' + pressure + '</span></li>';
         }
         
         output += '<li>Wind Speed <span>' + windSpeed + '</span></li>';
         output += '</ul></div></div><div class="summary"><h2>Next 24 hours</h2>';
         
         if (index < result.length-1) {
            index += 1;
            output += '<p>' + result[index].summary + ' ';
         } else {
            output += '<p>';
         }

         if (result[index].hasOwnProperty("precipType") && precipType == 'rain') {
            output += 'Chance of rain ' + precipProb + '. The highest temperatue <span class="temperatue">' + maxTemp + '</span> at around ' + maxTempHour + ', and the lowest temperature <span class="temperatue">'+ minTemp +'</span> at around ' + minTempHour + '.</p>';
         } else if (result[index].hasOwnProperty("precipType") && precipType == 'snow') {
            output += 'Chance of snow ' + precipProb + '. The highest temperatue <span class="temperatue">' + maxTemp + '</span> at around ' + maxTempHour + ', and the lowest temperature <span class="temperatue">'+ minTemp +'</span> at round ' + minTempHour + '.</p>';
         } else {
            output += 'The highest temperatue <span class="temperatue">' + maxTemp + '</span> at around ' + maxTempHour + ', and the lowest temperature <span class="temperatue">'+ minTemp +'</span> at around ' + minTempHour + '.</p>';
         }
         output += '</div></div></div>';

         element.append(output);
      });
}

// Load weather data for selected city 
function loadCity(city, convert){

    if (city.toLowerCase() == "current location") {
       $("#location").html('<i class="fa fa-location-arrow"></i>');
       if (navigator.geolocation) 
            navigator.geolocation.getCurrentPosition(success,loadDefaultCity);
       else {
            loadDefaultCity();
       }
    } else {
       loadweather(cities[city.toLowerCase()], convert);
       $("#location").html('<i class="fa fa-location-arrow"></i>' + city);
    }

}

// HTML5 geolocation success callback function
function success(position) {

    cities["current location"].coords.latitude = position.coords.latitude;
    cities["current location"].coords.longitude = position.coords.longitude;
    console.log(cities["current location"].coords);
    // Google Map API reverse geocoding
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            //Check result 0
            var result = results[0];
            console.log(results[0]);
            //look for locality tag and administrative_area_level_1
            var city = "";
            var state = "";
            for(var i = 0; i < result.address_components.length; i++) {
                var ac = result.address_components[i];
                if (ac.types.indexOf("locality") >= 0) city = ac.long_name;
                if (ac.types.indexOf("administrative_area_level_1") >= 0) state = ac.short_name;
            }
            //only report if we got Good Stuff
            if (city != '' && state != '') {
                $("#location").html('<i class="fa fa-location-arrow"></i>' + city + ", " + state);
                cityState = city + ", " + state;
            }
        } 
    });
    var id = $('#convert').find('.highlighted').attr('id');
    if (id === "celsius") {
       convert = true;
       loadweather(position, convert);
    } else {
       loadweather(position);
    }
}

// Load weather data for default city
function loadDefaultCity(){
    loadCity("Seattle");
}

$(document).ready(function(){
      loadCity("Current Location");

      // Load weather data for selected city and add active class to the link when tapping the city name
      $("a.city").bind("tap", function(){
           var city = $(this);
           var marker = $('#left-panel a').find('i');
           var id = $('#convert').find('.highlighted').attr('id');
           if (id === "celsius") {
             convTemp = true;
             loadCity(city.text(), convTemp);
           } else {
             loadCity(city.text());
           }
           if (marker.hasClass('active')) {
              marker.removeClass('active');
           } 
           city.find('i').addClass('active');                   
      });

      // Toggle weather info for current weather 
      $('#current_info').bind('click', function() {
           $(this).css('display', 'none');
           $('#tap').css('display', 'block');
      });
      
      $('#tap').bind('click', function() {
           $(this).css('display', 'none');
           $('#current_info').css('display', 'block');
      });
      
      // Hide the div when window laoding
      $(window).load(function() {
        $('#daily ul').find('#hide').hide();
      });
      
      // Slide down the daily weather info when tapping 
      $('#8days').bind('tap', function() {
           $(this).prev().removeClass('highlighted');
           $(this).addClass('highlighted');
           $('#hide').slideDown(400);
           $('#forecast').animate({height: '440px'}, 400);
      });
      
      // Slide up the daily weather info when tapping
      $('#5days').bind('tap', function() {
           $(this).next().removeClass('highlighted');
           $(this).addClass('highlighted');
           $('#forecast').animate({height: '330px'}, 400);
           $('#hide').slideUp(400);
      });
      
      // Convert the temperature to Celsius when tapping the C label
      $('#celsius').bind('tap', function() {
           $(this).prev('span').removeClass('highlighted');
           $(this).addClass('highlighted');
           var cityName = $('#location').text();
           var convertTemp = true;

           if (cityName.toLowerCase().indexOf(",") !== -1) {
              loadweather(cities['current location'], convertTemp);
           } else {
              loadweather(cities[cityName.toLowerCase()], convertTemp);
           }
      }); 
      
      // Convert the temperature to Fahrenheit when tapping the F label
      $('#fahrenheit').bind('tap', function() {
           $(this).next('span').removeClass('highlighted');
           $(this).addClass('highlighted weila');
           var cityName = $('#location').text();
           if (cityName.toLowerCase().indexOf(",") !== -1) {
              loadweather(cities['current location']);
           } else {
              loadweather(cities[cityName.toLowerCase()]);
           }
           
      });     
});