let heading = document.querySelector(".heading");
const button = document.querySelector("button");

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

  weatherData.currentConditions = weatherJSON.currentConditions;
  weatherData.days = {};
  for (let i = 0; i < 7; i++) {
    weatherData.days[i] = weatherJSON.days[i];
  }

  return weatherData;
};

button.addEventListener("click", () => {
  const city = prompt("What city?");
  getWeather(city)
    .then(processData)
    .then((weatherData) => {
      heading.textContent = `It's ${weatherData.currentConditions.temp}° F right now in ${weatherData.resolvedAddress}.`;
      return weatherData;
    });
});
