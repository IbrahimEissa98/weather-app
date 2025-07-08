// Loading page
window.addEventListener("load", function () {
  document.querySelector("#loader").classList.add("loader-out");
  setTimeout(removeLoader, 1000);
});
function removeLoader() {
  document.querySelector("#loader").classList.add("d-none");
}
var loader2 = document.querySelector(".loader-container");
function showLoader2() {
  loader2.classList.remove("d-none");
  loader2.classList.remove("loader-scaleOut");
}
function hideLoader2() {
  loader2.classList.add("loader-scaleOut");
  setTimeout(function () {
    loader2.classList.add("d-none");
  }, 550);
}
showLoader2();
// ===================================================
// Get the current location
// navigator.geolocation;
// ===================================================
// Navbar
var navContainer = document.querySelector("#nav-container");
var navIcons = Array.from(document.querySelectorAll(".menu-icon"));
var navPs = Array.from(document.querySelectorAll(".menu-icon p"));

// =============================================================
var searchInput = document.querySelector("input[type='search']");
var optionsList = document.querySelector(".search .options .list-group");
var currentDayWeatherContainer = document.querySelector(
  ".left-sec .day-weather"
);
var forecast3DaysContainer = document.querySelector(
  ".right-sec .three-days-forecast .row"
);
var highlightsContainer = document.querySelector(
  ".right-sec .today-highlights .row"
);
var hours24Container = document.querySelector(".right-sec .hours24 .row");

var latitude;
var longitude;
var ip;

async function getWeather(lat, lon) {
  try {
    showLoader2();
    var response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=7d77b96c972b4d119a3151101212704&q=${lat},${lon}&days=3`
    );
    response = await response.json();
    console.log(response);
    // console.log(response.current.last_updated.replace(/\s/, "T"));
    // var date = new Date(response.current.last_updated);
    // console.log(date);
    displayCurrentDay(response);
    displayForecastDays(response);
    displayHighlights(response);
    display24Hours(response);
    hideLoader2();
  } catch (error) {
    console.error("Error Getting weather:", error);
  }
}

async function search(value) {
  try {
    var response = await fetch(
      `https://api.weatherapi.com/v1/search.json?key=7d77b96c972b4d119a3151101212704&q=${value}`
    );
    var data = await response.json();
    // console.log(data);
    // console.log(data.length);
    // console.log(response.ok);
    // console.log(response.status);
    var arr = [];
    for (let i = 0; i < data.length; i++) {
      arr.push(data[i]);
    }
    // console.log(arr);

    return arr;
  } catch (error) {
    console.error("Error while searching:", error);
  }
}

searchInput.addEventListener("input", async function () {
  optionsList.classList.remove("d-none");
  var value = this.value.trim();
  // search(value);
  if (value.length > 0) {
    var places = await search(value);

    if (places.length == 0) {
      optionsList.innerHTML = `<p
                      class="list-group-item text-danger list-group-item-action list-group-item-dark"
                      aria-current="true"
                    >
                      No places found with this name!
                    </p>`;
    } else {
      var carton = ``;
      for (let i = 0; i < places.length; i++) {
        carton += `<li
                      class="list-group-item list-group-item-action list-group-item-dark bg-opacity-100"
                      aria-current="true"
                    >
                      <p class="name text-primary m-0">${places[i].name}</p>
                      <div class="">
                        <span class="region">${places[i].region}</span>
                        <span class="country">${places[i].country}</span>
                      </div>
                    </li>`;
      }
      // console.log(places);

      document.querySelector(".search .options .list-group").innerHTML = carton;

      // console.log(chooseOption(places));
      chooseOption(places);
    }
  } else {
    optionsList.classList.add("d-none");
  }
});

// searchInput.addEventListener("blur", function () {
//   setTimeout(function () {
//     optionsList.classList.add("d-none");
//     searchInput.value = "";
//   }, 100);
// });

//progress
// var progress = document.querySelector(".graph .over");
// progress.style.cssText = `transform: rotate(${15 * 3}deg);`;
// var prog = document.querySelector(".uv-progress");
// console.log(prog.style.width);
// document.addEventListener("resize", function (e) {
//   var width = prog.offsetWidth;
//   console.log(width);
// });

// ----------------------

// Choose from options list
function chooseOption(places) {
  var options = Array.from(
    document.querySelectorAll(".search .options .list-group .list-group-item")
  );

  for (let i = 0; i < options.length; i++) {
    options[i].addEventListener("click", async function (e) {
      var checkedOption = options.indexOf(this);

      // id = places[checkedOption].id;
      latitude = places[checkedOption].lat;
      longitude = places[checkedOption].lon;
      optionsList.classList.add("d-none");
      searchInput.value = "";
      // console.log(id);
      await getWeather(latitude, longitude);
    });
  }
}
// -----------------------

// Get Location throw ip
async function getLocation() {
  try {
    var response = await fetch(`https://ipapi.co/json/`);
    var data = await response.json();
    console.log(data);
    latitude = data.latitude;
    longitude = data.longitude;
  } catch (error) {
    console.error("Error fetching IP address:", error);
  }
}
// getLocation();
// getIP().then(getLocation);
// console.log(ip);
async function getFullLocation() {
  await getLocation();
  await getWeather(latitude, longitude);
}
getFullLocation();

// ---------------------------
// Display Weather
function getDayWord(dayNum) {
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[dayNum];
}
function getMonthWord(monthNum) {
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[monthNum];
}
function displayCurrentDay(res) {
  var currentDay = res.current;
  var currentDayDate = new Date(currentDay.last_updated);
  var currentDayIcon = currentDay.condition.icon.split("/");
  currentDayIcon[4] = "128x128";
  currentDayIcon = currentDayIcon.join("/");
  // console.log(currentDayIcon);
  // console.log(currentDayDate);

  var data = `<div class="weather-icon w-100">
                <h3 class="text-center mt-3">${res.location.name}</h3>
                <img
                  src="https:${currentDayIcon}"
                  alt="weather icon"
                  class="d-block m-auto"
                />
              </div>
              <div class="weather-degree">
                <p>${Math.round(currentDay.temp_c)}<sup>&#176;C</sup></p>
              </div>
              <div class="day-hour-date">
                <div>
                  <span class="day">${getDayWord(
                    currentDayDate.getDay()
                  )},</span>
                  <span class="hour text-white-50 ms-1">${currentDayDate.getHours()}:${
    currentDayDate.getMinutes() < 10
      ? "0" + currentDayDate.getMinutes()
      : currentDayDate.getMinutes()
  }</span>
                </div>
                <div>
                  <span class="date">${currentDayDate.getDate()} ${getMonthWord(
    currentDayDate.getMonth()
  )}</span>
                </div>
              </div>
              <div class="secondary-info py-5">
                <div class="mb-3">
                  <i class="fa-solid fa-cloud"></i> <span>${
                    currentDay.condition.text
                  }</span>
                </div>
                <div>
                  <i class="fa-solid fa-droplet"></i>
                  <span>Reel feel - ${Math.round(
                    currentDay.feelslike_c
                  )}<sup>&#176;C</sup></span>
                </div>
              </div>
              <div class="weather-location py-2 px-2 mt-3">
                <p class="py-5 m-0 text-center">${res.location.name} <br/> ${
    res.location.region
  } <br/> ${res.location.country}</p>
              </div>`;

  currentDayWeatherContainer.innerHTML = data;
}
function displayForecastDays(res) {
  var forecastDays = res.forecast.forecastday;
  var carton = "";
  // console.log(currentDayIcon);
  // console.log(currentDayDate);

  for (let i = 0; i < forecastDays.length; i++) {
    var forecastDay = forecastDays[i];
    var currentDayDate = new Date(forecastDay.date);

    carton += `<div class="col-4">
                  <div class="inner-day">
                    <p class="m-0 mb-2">${getDayWord(
                      currentDayDate.getDay()
                    )}</p>
                    <img
                      src="https:${forecastDay.day.condition.icon}"
                      alt="condition"
                    />
                    <p class="m-0 mt-2">
                      <span>${Math.round(
                        forecastDay.day.maxtemp_c
                      )} <sup>&#176;</sup></span
                      ><span class="sp2 ms-2">${Math.round(
                        forecastDay.day.mintemp_c
                      )} <sup>&#176;</sup></span>
                    </p>
                  </div>
                </div>`;
  }

  forecast3DaysContainer.innerHTML = carton;
}
function displayHighlights(res) {
  var data = `<div class="col-12 col-sm-4 col-md-4">
                  <div
                    class="inner-highlight d-flex flex-column justify-content-between"
                  >
                    <p class="inner-title">Wind Status</p>
                    <h5 class="">${res.current.wind_kph}<sub>km/h</sub></h5>
                    <div class="wind-direction d-flex align-items-center">
                      <i class="fa-solid fa-compass"></i>
                      <p class="m-0 ms-2">${res.current.wind_dir}</p>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-sm-4 col-md-4">
                  <div class="inner-highlight">
                    <p class="inner-title">Sunrise & Sunset</p>
                    <div class="sun d-flex align-items-center mt-4">
                      <i class="fa-solid fa-circle-up"></i>
                      <p class="m-0 ms-2">${res.forecast.forecastday[0].astro.sunrise}</p>
                    </div>
                    <div class="sun d-flex align-items-center mt-4">
                      <i class="fa-solid fa-circle-down"></i>
                      <p class="m-0 ms-2">${res.forecast.forecastday[0].astro.sunset}</p>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-sm-4 col-md-4">
                  <div
                    class="inner-highlight d-flex flex-column justify-content-between"
                  >
                    <p class="inner-title">Humidity</p>
                    <h5 class="">${res.current.humidity}<sup>%</sup></h5>
                    <p class="average sub-title">
                      Average <span class="ms-2 text-white">${res.forecast.forecastday[0].day.avghumidity}</span
                      ><sup>%</sup>
                    </p>
                  </div>
                </div>`;

  highlightsContainer.innerHTML = data;
}
function display24Hours(res) {
  var currentDay = res.current;
  var currentDayDate = new Date(currentDay.last_updated);
  var currentDayHour = currentDayDate.getHours();
  var counter = currentDayHour;
  var day = 0;

  var carton = "";
  // console.log(currentDayIcon);
  // console.log(currentDayDate);

  for (let i = 0; i < 24; i++) {
    var hour;
    if (counter > 23) {
      counter = 0;
      day = 1;
    }
    var date = new Date(res.forecast.forecastday[day].hour[counter].time);
    if (currentDayHour == counter) {
      hour = "Now";
    } else if (counter == 0 && day == 1) {
      hour = `${date.getDate()}/${date.getMonth() + 1}`;
    } else {
      hour = `${date.getHours()}:00`;
    }

    carton += `<div class="col-3 col-md-2">
                    <div class="inner-day">
                      <p class="m-0 mb-1">${Math.round(
                        res.forecast.forecastday[day].hour[counter].temp_c
                      )} <sup>&#176;</sup></p>
                      <img
                        src="https:${
                          res.forecast.forecastday[day].hour[counter].condition
                            .icon
                        }"
                        alt="condition"
                      />
                      <p class="m-0 mt-1 text-white-50">${
                        res.forecast.forecastday[day].hour[counter].wind_kph
                      }<sub>km/h</sub></p>
                      <p class="m-0 mt-1 text-white-50">${hour}</p>
                    </div>
                  </div>`;
    counter++;
  }

  hours24Container.innerHTML = carton;
}
