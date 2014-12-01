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

           var forecastURL = "https://api.forecast.io/forecast/65f98f4cff0e84f5fec4ea1bdf393243/"+latlng;

           $.ajax({
              url: forecastURL,
              jsonpCallback: 'jsonpCallback',
              contentType: "application/json",
              dataType: 'jsonp',
              success: function(result) {
          
                currentWeather(result);
                currentSpecific(result);
                getDailyWeather(result);
                dailyWeatherDetails(result);
                
                getHourlyWeather(result);
                
              },
              error: function(result) {
                console.log(e.message);
              },
              complete: function(event) {
                $('#hide').hide();
              }
           });
       }

       function currentWeather(data) {
          $("#current_temp").html(Math.round(data.currently.temperature) + "&#176;");
          $("#current_summary").html(data.currently.summary);
          $("#current_temp").attr("data-icon", icons[data.currently.icon]);
          $('.fa-long-arrow-up').html(Math.round(data.daily.data[0].temperatureMax) + "&#176;");
          $('.fa-long-arrow-down').html(Math.round(data.daily.data[0].temperatureMin) + "&#176;");
          var precipType = data.currently.precipType;
          var precipProb = Math.round(data.currently.precipProbability * 100);
          if (precipType === 'rain' || precipProb === 0) {
            var rain = $('.pType').removeClass('icon').attr('data-icon', '');
            rain.addClass('fa fa-umbrella').html( precipProb + "%");
          } else {
            var snowType = $('.pType').removeClass('fa fa-umbrella').addClass('icon');
            snowType.attr("data-icon", icons['SNOW']);
          }
       }

       function currentSpecific(data) {
          $('#current_humidity').find('span').html((data.currently.humidity * 100) + "%");
          $('#current_dewpoint').find('span').html(Math.round(data.currently.dewPoint) + "&#176;");
          $('#current_visibility').find('span').html(Math.round(data.currently.visibility) + " mi");
          $('#current_windspeed').find('span').html(Math.round(data.currently.windSpeed) + " mph");
          $('#current_pessure').find('span').html(Math.round(data.currently.pressure) + " mb");
          $('#feel_like').find('span').html(Math.round(data.currently.dewPoint) + "&#176;");
       }

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

      function getCurrentTime(data) {
        var t = new Date(data.currently.time * 1000);
        var hour = t.getHours();
        var min = t.getMinutes() < 10 ? '0' + t.getMinutes() : t.getMinutes();
        var time = hour + ':' + min;

        if (hour === 0) {
           hour = 12;
           time += ' AM';
        } else if ( hour > 0 && hour < 12) {
           time += ' AM';
        } else if ( hour === 12) {
           time += ' PM'; 
        } else {
           time = time - 12;
           time += ' PM';
        }
        return time;
      }

      function getHourlyWeather(data) {
         var result = data.hourly.data;
         $('#hourly ul').html('');

         $.each(result, function(index) {
             
             var output = '<li>';

             var temp = Math.round(result[index].temperature) + "&#176;";
             var icon_key = result[index].icon;     
             var t = new Date(result[index].time * 1000);
             var hour = convertHour(t);
             if (index == 0) {
               output += '<span class="hour">Now</span>';
             } else {
               output += '<span class="hour">' + hour + '</span>';
             }
             output += '<span class="icon" data-icon="' + icons[icon_key] + '"></span>';
             output += '<span class="hour-temp">' + temp + '</span></li>';
             $('#hourly ul').append(output);
         });
      }

      function convertHour(time) {

         var hour = time.getHours();
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

      function getDailyWeather(data) {
         var result = data.daily.data;
         var $hide = $('<div id="hide"></div>');
         $('#daily ul').html('');
         
         $.each(result, function(index) {
             var output = '<li>';

             var minTemp = Math.round(result[index].temperatureMin) + "&#176;";
             var maxTemp = Math.round(result[index].temperatureMax) + "&#176;";
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
             if (minTemp > 9) {
                output += '<span class="maxMinTemp">' + maxTemp + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + minTemp + '</span></li>';
             } else if ( minTemp >= 0 && minTemp <= 9) {
                output += '<span class="maxMinTemp">' + maxTemp + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + minTemp + '</span></li>';
             } else {
                output += '<span class="maxMinTemp">' + maxTemp + '&nbsp;&nbsp;&nbsp;' + minTemp + '</span></li>';
             }

             if(index < 5) {
                $('#daily ul').append(output);
             } else {
                $hide.append(output);
             }             
         });
         $('#daily ul').append($hide);
      }

      function convertHourMin(time) {

         var hour = time.getHours();
         var min = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
         var hourMin = '';

         if (hour === 0) {
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

      function dailyWeatherDetails(data) {
          var result = data.daily.data;
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
             
             var srhour = convertHourMin(srt);
             var sshour = convertHourMin(sst);
             var minTempHour = convertHour(minTempTime);
             var maxTempHour = convertHour(maxTempTime);

             var minTemp = Math.round(result[index].temperatureMin) + "&#176;";
             var maxTemp = Math.round(result[index].temperatureMax) + "&#176;";
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
                output += 'Chance of rain ' + precipProb + '. The highest temperatue ' + maxTemp + ' at around ' + maxTempHour + ', and the lowest temperature '+ minTemp +' at around ' + minTempHour + '.</p>';
             } else if (result[index].hasOwnProperty("precipType") && precipType == 'snow') {
                output += 'Chance of snow ' + precipProb + '. The highest temperatue ' + maxTemp + ' at around ' + maxTempHour + ', and the lowest temperature '+ minTemp +' at ' + minTempHour + '.</p>';
             } else {
                output += 'The highest temperatue ' + maxTemp + ' at around ' + maxTempHour + ', and the lowest temperature '+ minTemp +' at around ' + minTempHour + '.</p>';
             }
             output += '</div></div></div>';

             element.append(output);
          });
      }

       function loadCity(city){
          $("#location").html('<i class="fa fa-location-arrow"></i>' + city);

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

            $("a.city").bind("tap", function(){
                   var city = $(this);
                   var marker = $('#left-panel a').find('i');
                   loadCity(city.text());
                   if (marker.hasClass('active')) {
                      marker.removeClass('active');
                   } 
                   city.find('i').addClass('active');                   
            });

            $('#current_info').bind('tap', function() {
                 $(this).css('display', 'none');
                 $('#tap').css('display', 'block');
            });

            $('#tap').bind('tap', function() {
                 $(this).css('display', 'none');
                 $('#current_info').css('display', 'block');
            });

            $(window).load(function() {
              $('#daily ul').find('#hide').hide();
            });

            $('#8days').bind('tap', function() {
                 $(this).prev().removeClass('highlighted');
                 $(this).addClass('highlighted');
                 $('#hide').slideDown('show');
                 $('#forecast').animate({height: '440px'}, 400);
            });

            $('#5days').bind('tap', function() {
                 $(this).next().removeClass('highlighted');
                 $(this).addClass('highlighted');
                 $('#forecast').animate({height: '330px'}, 400);
                 $('#hide').slideUp('show');

            });

            
       });