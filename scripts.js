let heading = document.querySelector(".heading");
const form = document.querySelector("form");
const search = document.getElementById("search");
const unitToggle = document.getElementById("units");

let unitGroup = "us";
let tempUnit = "F";

heading.style.backgroundColor = "blue";

const toggleUnits = () => {
  unitGroup = unitToggle.checked ? "metric" : "us";
  tempUnit = unitToggle.checked ? "C" : "F";
};

const getWeather = async (city, unit = "us") => {
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
    weatherData.days[i] = weatherJSON.days[i];
  }
  return weatherData;
};

const renderWeather = (weatherData) => {
  heading.textContent = `It's ${weatherData.currentConditions.temp}° ${tempUnit} right now in ${weatherData.resolvedAddress}.`;
};

const submitEventHandler = async function (event) {
  event.preventDefault(); // don't actually submit the form

  const city = search.value;
  let weatherJSON = await getWeather(city, unitGroup);
  let weatherData = await processData(weatherJSON);
  renderWeather(weatherData);
};

form.addEventListener("submit", submitEventHandler);
unitToggle.addEventListener("click", toggleUnits);
