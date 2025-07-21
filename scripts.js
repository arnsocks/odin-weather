let heading = document.querySelector(".heading");
const form = document.querySelector("form");
const search = document.getElementById("search");

heading.style.backgroundColor = "blue";

const getWeather = async (city, unit = "us") => {
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
    weatherData.days[i] = weatherJSON.days[i];
  }

  return weatherData;
};

const renderWeather = (weatherData) => {
  heading.textContent = `It's ${weatherData.currentConditions.temp}° F right now in ${weatherData.resolvedAddress}.`;
};

const submitEventHandler = async function (event) {
  event.preventDefault();

  const city = search.value;
  let weatherJSON = await getWeather(city);
  let weatherData = await processData(weatherJSON);
  renderWeather(weatherData);
};

form.addEventListener("submit", submitEventHandler);
