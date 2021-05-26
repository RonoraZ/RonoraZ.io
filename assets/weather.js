//Setting up variables and selectors 
var date = moment().format("ll"); 
var search = document.querySelector("#search-form"); 
var barSearch = document.querySelector("#search-value"); 
var response2 = document.createElement("div"); 
var deleteButton = document.getElementById("#delete-button"); 
var tempt = document.getElementById("tempt");
//Setting up the variables in temperature 
var cityTempatureDiv = document.createElement('div'); 
var detailsOfCityDiv = document.createElement('div'); 
var nameOfCityEl = document.createElement("div"); 
var currentTemperatureEl = document.createElement("div"); 
var humidityEl = document.createElement("div"); 
var windEl = document.createElement("div"); 
var uvIndexContainer = document.createElement("div"); 
var uvIndexEl = document.createElement("div"); 
var uvValueDisplay = document.createElement("div"); 

//Show casing the 5- day forecast . 
var forecast = document.querySelector("#forecast");  

var searchWrapEl = document.querySelector("#search-wrapper"); 
var searchHistoryDiv = document.querySelector("#history"); 
var city= 1; 

//Showing the function to fetch a weather api/city when recieved from the search event and value .  
var weatherRequest= function(){  
    var city = document.getElementById("search-value").value.trim()
//Apending history to display search-results underneath 
   // var history= document.getElementById("history") 
   // var section = document.createElement("li");  
   // section.classList.add("city-items")
   // section.innerText = city
    //history.append(section) 
    //numberofCity++
    if(!city){ 
        return;
    }; 
    var weatherApi =  "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=117dc3b2338db533eebb9a9c407cc7e0";
    console.log(weatherApi);
    //Fetching the response  
    fetch(weatherApi) 
    .then(function(response){ 
        if(!response || !response.ok){ 
            throw new Error('There was an error');
        }; 
        return response.json();
    }) 
    .then(function(response){ 
    //div that will contain the temperature of the city and its current temperature. 
    cityTempatureDiv.classList = 'temperature-div'; 
   // cityTempatureDiv.inn = response.main.temp;  

    console.log(response);
    
    //In  this div will contain humidity,wind speed and the uv index . 
    cityTempatureDiv.classList = 'facts-div'; 
   // response.appendChild(cityTempatureDiv);  


    //City name responses by creating an element. 

    nameOfCityEl.innerHTML = "<h2 class='nav-text'>Current Weather for <span class = 'font-weight-bold'>" + response.name + "</span></h2><br><img class='nav-icon' src='http:\/\/openweathermap.org\/img\/w\/"+ response.weather[0].icon + ".png' alt='Current Weather Icon'/><br><h2 class = 'font-weight-bold nav-text'>"+ date + "</h2></br>"; 
    cityTempatureDiv.appendChild(nameOfCityEl); 

    //Making an element to display the current temperatures of each city . 
    currentTemperatureEl.innerHTML = "<h3 class='nav-text'>Current Temperature :<span class='font-weight-bold'>"+" "+ Math.round(response.main.temp)+"&#176C</span></h3><br>"; 
    cityTempatureDiv.appendChild(currentTemperatureEl); 

    //Constructing an element that will display humidity 
    
    humidityEl.innerHTML = "<h3 class='nav-text'>Humidity:<span class='font-weight-bold'> " + " "+ response.main.humidity + "%</span></h4>"; 
    detailsOfCityDiv.appendChild(humidityEl); 
    
    //Constructing an element that will display the wind . 

    windEl.innerHTML = "<h4 class='nav-text'>Wind Speed :<span class='font-weight-bold'>"+" "+ Math.round(response.wind.speed)+"MHP</span></h4><br>"; 
    detailsOfCityDiv.appendChild(windEl);  

    tempt.appendChild(cityTempatureDiv); 
    tempt.appendChild(detailsOfCityDiv);
    //Using the fetch for the uv index . 

    return fetch("https://api.openweathermap.org/data/2.5/uvi?appid=117dc3b2338db533eebb9a9c407cc7e0&lat=" + response.coord.lat + "&lon=" + response.coord.lon);

    }) 
    //Showing the function that will return the fetch to the json 
    .then(function(uvFetch){ 
        return uvFetch.json();
    }) 
    //Creating a container for the uv index 
    .then(function(uvAnswer){ 
        uvIndexContainer.setAttribute("id","uv-prize"); 
        uvIndexContainer.classList = "nav-text uv-list"; 
        detailsOfCityDiv.append(uvIndexContainer); 
        
     //Setting a value for the uv index 
     var valueofUV = uvAnswer.value; 
     uvIndexEl.innerHTML = "UV Index: "; 

     uvValueDisplay.setAttribute("id","uv-index"); 
     uvValueDisplay.innerHTML = valueofUV; 
     uvIndexContainer.append(uvIndexEl); 
     uvIndexContainer.append(uvValueDisplay); 

     if (uvAnswer.value > 7){ 
        document.querySelector("#uv-index").classList = "uv-result rounded bg-danger";
     }  else if (uvAnswer.value >= 2 && uvAnswer.value <= 7){  
        document.querySelector("#uv-index").classList = "uv-result rounded bg-warning";
     } else if (uvAnswer.value <= 2){ 
        document.querySelector("#uv-index").classList = "uv-result rounded bg-success";
     } 

     return fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + uvAnswer.lat + "&lon=" + uvAnswer.lon + "&appid=117dc3b2338db533eebb9a9c407cc7e0&units=metric");

    }) 
    //Creating a a function to respon to the json. 
    .then(function(responseForecast){ 
        return responseForecast.json();
    }) 

    //Creating a 5 day forecast loop 
    .then(function(responseForecast){ 
        console.log(responseForecast);
        var containerForecast = document.getElementById("display")
        for (var i = 1; i <6; i++){ 
            var forecastDisplay = document.createElement("div");
            forecastDisplay.classList = "forecast-card card-body rounded-lg border-light bg-primary text-dark";
        
       
       //Showing the displayed date on the forecast card 
       var timeDiv = document.createElement("div");
                timeDiv.classList = "secondary-text card-title";
                var forecastTime = moment.unix(responseForecast.daily[i].dt).format("dddd, MMM DD");
                timeDiv.innerHTML = "<h5 class='font-weight-bold'>" + forecastTime + "</h5>";
                forecastDisplay.appendChild(timeDiv); 

       //Displaying the weather icon 
       var weatherIcon = document.createElement("div");
                weatherIcon.innerHTML = "<img src='http://openweathermap.org/img/w/" + responseForecast.daily[i].weather[0].icon + ".png' class='forecast-icon' alt=Current weather icon/>";
                forecastDisplay.appendChild(weatherIcon); 

       //Displaying the day temperature forecast 
       
       var temperatureDiv = document.createElement("div");
                temperatureDiv.classList = "card-text secondary-text";
                temperatureDiv.innerHTML = "<h6>Min Temp:<span>" + " " + responseForecast.daily[i].temp.min + "&#176C</span></h6>" + "<h6>Max Temp:<span>" + " " + responseForecast.daily[i].temp.max + " &#176C</span></h6>";
                forecastDisplay.appendChild(temperatureDiv); 

       //Displaying the humidity of the forecast 
       
       var humidityDiv = document.createElement("div");
                humidityDiv.classList = "card-text secondary-text";
                humidityDiv.innerHTML = "<h6>Humidity:<span>" + " " + responseForecast.daily[i].humidity + "%</span></h6>";
                forecastDisplay.appendChild(humidityDiv)
       
       
                containerForecast.appendChild(forecastDisplay);
       
        }; 
            
    })
} 
//.catch(function (error) {
    //removePrevious();
    //alert(error.message);
    //document.querySelector("#search-bar").value = "";
    //return;
//});

// clicking the search button will  submits for the weatherRequest function
var eventSearch = function (event) {
event.preventDefault();
var valueSearch = barSearch.value.trim().toUpperCase();

//Catching any errors happening on weatherRequest and  creatingBtn/storedHistory
if (valueSearch) {
weatherRequest(valueSearch);
creatingBtn(valueSearch);
storedHistory();

} else {

//if the search is empty throw an alert 
alert("Please enter a city to see its current weather.");
};
};
//Creating the buttons
function creatingBtn(city) {

var searchCity = document.createElement("button");
searchCity.textContent = city;
searchCity.classList = "btn btn-primary btn-block";
searchCity.setAttribute("data-city", city);
searchCity.setAttribute("type", "submit");
searchCity.setAttribute("id", "city-" + city);
searchHistoryDiv.prepend(searchCity);
};

function clearHistory() {
var researchedCities = JSON.parse(localStorage.getItem("researchedCities"));
for (var i = 0; i < researchedCities.length; i++) {
document.getElementById("city-" + researchedCities[i]).remove();
}
localStorage.clear("researchedCities");
};
// variables to store the storage keys in the if statements that are used .
function storedHistory() {
var searchUser = document.querySelector("#search-value").value.trim().toUpperCase();

if (!searchUser) {
return;
};

var beforeCitySearch = JSON.parse(localStorage.getItem("researchedCities")) || []; 
console.log(`beforeCitySearch; ${beforeCitySearch}`);
beforeCitySearch.push(searchUser);
localStorage.setItem("researchedCities", JSON.stringify(beforeCitySearch));

// Clearing the search bar .
document.querySelector("#search-value").value = "";

// calling the  function in order to remove prevoious search 
removePrevious();
};

function loadHistory() {
if (localStorage.getItem("researchedCities")) {
var beforeCitySearch = JSON.parse(localStorage.getItem("researchedCities"));
for (var i = 0; i < beforeCitySearch.length; i++) {
    creatingBtn(beforeCitySearch[i]);
}
};


for (i = 0; i < document.getElementsByClassName("btn").length; i++) {
document.getElementsByClassName("btn")[i].addEventListener('click', function () {
    var buttonClicked = this.getAttribute("data-city");
    weatherRequest(buttonClicked);
    console.log(buttonClicked);
    removePrevious();
});
}
};

// Removes previous search info
var removePrevious = function () {
nameOfCityEl.remove();
uvIndexContainer.remove();
forecast.innerHTML = "";
currentTemperatureEl.remove();
humidityEl.remove();
windEl.remove(); 
var containerForecast = document.getElementById("display") 
containerForecast.innerHTML = ""; 

};

var searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", eventSearch);
var deleteButton = document.getElementById("delete-button");
deleteButton.addEventListener("click", clearHistory);

loadHistory();
//Adding eventClick function to the search and delete button  
//function removeCity(){ 
      //document.querySelectorAll(".city-items")[numberofCity].remove(); 
      
    
//}
 
  
var numberofCity = 0;
searchButton.addEventListener("click",weatherRequest);  

//deleteButton.addEventListener("click",removeCity)
