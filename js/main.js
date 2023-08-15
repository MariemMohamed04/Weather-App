let search_ = document.getElementById("search");
let today_Name = document.getElementById("todayName");
let today_Date = document.getElementById("todayDate");
let today_Month = document.getElementById("todayMonth");
let today_Loc = document.getElementById("todayLoc");
let today_Deg = document.getElementById("todayDeg");
let today_Img = document.getElementById("todayImg");
let today_Cond = document.getElementById("todayCond");
let today_Humidity = document.getElementById("todayHumidity");
let today_Wind = document.getElementById("todayWind");
let today_Dir = document.getElementById("todayDir");
let tmrw_Name = document.getElementsByClassName("tmrwName");
let tmrw_Img = document.getElementsByClassName("tmrwImg");
let tmrw_MaxDeg = document.getElementsByClassName("tmrwMaxDeg");
let tmrw_MinDeg = document.getElementsByClassName("tmrwMinDeg");
let tmrw_Cond = document.getElementsByClassName("tmrwCond");
let WeatherArray;

// Fetch Data
async function GetData(loc) {
  try {
    let encodedLocName = encodeURIComponent(loc);
    let response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=a61e8995bdcf49d888f23540231508&q=${encodedLocName}&days=3`
    );
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    let weatherData = await response.json();
    return weatherData;
  } catch (error) {
    console.error("API Error:", error);
  }
}

// Display Today's Data
function DisplayTodayData(e) {
  let todayData = new Date();
  today_Name.innerHTML = todayData.toLocaleDateString("en-us", {
    weekday: "long",
  });
  today_Date.innerHTML = todayData.getDate();
  today_Month.innerHTML = todayData.toLocaleDateString("en-us", {
    month: "long",
  });
  today_Loc.innerHTML = e.location.name;
  today_Deg.innerHTML = e.current.temp_c;
  const iconUrl = `https:${e.current.condition.icon}`;
  today_Img.setAttribute("src", iconUrl);
  today_Cond.innerHTML = e.current.condition.text;
  today_Humidity.innerHTML = e.current.humidity;
  today_Wind.innerHTML = e.current.wind_kph;
  today_Dir.innerHTML = e.current.wind_dir;
}

// Display Tomorrow's and After Tomorrow's Data
function DisplayTmrwDate(e) {
  let forecastData = e.forecast.forecastday;
  for (let i = 0; i < 2; i++) {
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + i + 1);
    tmrw_Name[i].innerHTML = tomorrow.toLocaleDateString("en-us", {
      weekday: "long",
    });
    const iconTmrw = `https:${forecastData[i + 1].day.condition.icon}`;
    tmrw_Img[i].setAttribute("src", iconTmrw);
    tmrw_MaxDeg[i].innerHTML = forecastData[i + 1].day.maxtemp_c;
    tmrw_MinDeg[i].innerHTML = forecastData[i + 1].day.mintemp_c;
    tmrw_Cond[i].innerHTML = forecastData[i + 1].day.condition.text;
  }
}

// Calling Functions
async function callFunctions(locName = "alexandria") {
  let weatherData = await GetData(locName);
  DisplayTodayData(weatherData);
  DisplayTmrwDate(weatherData);
}
callFunctions();

// Search Function
search_.addEventListener("input", async function () {
  if (search_.value.trim() === "") {
    // If search input is empty, use geolocation
    callFunctionsUsingGeolocation();
  } else {
    callFunctions(search_.value);
  }
});

// GeoLocation
async function getUserLocation() {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        }
      );
    } else {
      reject(new Error("Geolocation is not available in this browser."));
    }
  });
}

async function callFunctionsUsingGeolocation() {
  try {
    const userLocation = await getUserLocation();
    const weatherData = await GetData(
      `${userLocation.latitude},${userLocation.longitude}`
    );
    DisplayTodayData(weatherData);
    DisplayTmrwDate(weatherData);
  } catch (error) {
    console.error("Error getting geolocation:", error);
  }
}

