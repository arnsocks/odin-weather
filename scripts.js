const form = document.querySelector("form");
const search = document.getElementById("search");
const unitToggle = document.getElementById("units");
const currentWrapper = document.querySelector(".current-wrapper");
const forecastWrapper = document.querySelector(".forecast-wrapper");

let currentUnit = "us";
unitToggle.checked = false;

const unitGroups = {
  us: {
    name: "us",
    temperature: "F",
    precipitation: '"',
    snow: '"',
    wind: "MPH",
    visibility: "mi.",
    pressure: "mbar",
  },
  metric: {
    name: "metric",
    temperature: "C",
    precipitation: "mm",
    snow: "mm",
    wind: "Km/h",
    visibility: "Km",
    pressure: "mbar",
  },
};

// Needed to properly display the day of the week in the forecast
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const toggleUnits = () => {
  currentUnit = unitToggle.checked ? "metric" : "us";
};

const getWeather = async (city = "New York City", unit = "us") => {
  console.log(
    `You asked for the weather in ${city} using the ${unit} system. `
  );
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${unit}&include=current&key=CGFGTC498RSULEKK8AJRBS8N2&contentType=json`
    );
    if (!response.ok) throw new Error(response.status); // make sure the response is OK
    const weatherData = await response.json();
    console.log(weatherData);
    return weatherData;
  } catch (err) {
    console.error(err);
  }
};

const processData = (weatherJSON) => {
  let weatherData = {};
  weatherData.resolvedAddress = weatherJSON.resolvedAddress;
  weatherData.currentConditions = weatherJSON.currentConditions;
  weatherData.days = {};
  for (let i = 0; i < 7; i++) {
    weatherData.days[i] = weatherJSON.days[i + 1];
  }
  return weatherData;
};

const renderWeather = (weatherData) => {
  currentWrapper.textContent = ""; // clear existing weather info
  const currentIcon = document.createElement("img");
  currentIcon.classList.add("current-icon");
  currentIcon.src = `img/${weatherData.currentConditions.icon}.svg`;

  const currentTemp = document.createElement("p");
  currentTemp.textContent = `${weatherData.currentConditions.temp}° ${unitGroups[currentUnit].temperature}`;

  const currentFeel = document.createElement("p");
  currentFeel.textContent = `Feels like: ${weatherData.currentConditions.feelslike}° ${unitGroups[currentUnit].temperature}`;

  const currentHumidity = document.createElement("p");
  currentHumidity.textContent = `Humidity: ${weatherData.currentConditions.humidity}%`;

  const currentWind = document.createElement("p");
  currentWind.textContent = `Windspeed: ${weatherData.currentConditions.windspeed}${unitGroups[currentUnit].wind}`;

  const currentUV = document.createElement("p");
  currentUV.textContent = `UV Index: ${weatherData.currentConditions.uvindex}`;

  currentWrapper.appendChild(currentIcon);
  currentWrapper.appendChild(currentTemp);
  currentWrapper.appendChild(currentFeel);
  currentWrapper.appendChild(currentHumidity);
  currentWrapper.appendChild(currentWind);
  currentWrapper.appendChild(currentUV);

  forecastWrapper.textContent = ""; // clear existing weather info
  for (let i = 0; i < 7; i++) {
    const myDateObj = new Date(weatherData.days[i].datetime);
    const myDayName = days[myDateObj.getUTCDay()];
    const myDayDiv = document.createElement("div");
    myDayDiv.classList.add("forecast-day");

    const myDate = document.createElement("p");
    myDate.textContent = myDayName + "\n" + myDateObj.getUTCDate();
    myDayDiv.appendChild(myDate);
    forecastWrapper.appendChild(myDayDiv);
  }
};

const submitEventHandler = async function (event) {
  event.preventDefault(); // don't actually submit the form

  const city = search.value;
  let weatherJSON = await getWeather(city, currentUnit);
  let weatherData = await processData(weatherJSON);
  renderWeather(weatherData);
};

form.addEventListener("submit", submitEventHandler);
unitToggle.addEventListener("click", toggleUnits);
