/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./src/data-fetcher.js
const API_KEY = "6LGV7CTWHZN4M96CEKSX33LL2";

function fetchData(location, unit = "metric") {
  return new Promise((resolve, reject) => {
    const baseUrl =
      "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
    const contentType = "json";
    const url = `${baseUrl}${location}?unitGroup=${unit}&key=${API_KEY}&contentType=${contentType}`;

    fetch(url, { mode: "cors" })
      .then((response) => {
        if (!response.ok) {
          reject(new Error(`HTTP error! status: ${response.status}`));
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          reject(new Error("Not a JSON response"));
        }
        return response.json();
      })
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
}

function cleanData(data) {
  return {
    location: data.resolvedAddress,
    tzoffset: data.tzoffset,
    description: data.description,
    currentConditions: {
      datetime: data.currentConditions.datetime,
      temp: data.currentConditions.temp,
      feelslike: data.currentConditions.feelslike,
      humidity: data.currentConditions.humidity,
      dew: data.currentConditions.dew,
      precip: data.currentConditions.precip,
      precipprob: data.currentConditions.precipprob,
      pressure: data.currentConditions.pressure,
      visibility: data.currentConditions.visibility,
      conditions: data.currentConditions.conditions,
      icon: data.currentConditions.icon,
      sunrise: data.currentConditions.sunrise,
      sunset: data.currentConditions.sunset,
    },
    days: data.days.map((day) => {
      return {
        datetime: day.datetime,
        tempmax: day.tempmax,
        tempmin: day.tempmin,
        precipprob: day.precipprob,
        preciptype: day.preciptype,
        conditions: day.conditions,
        description: day.description,
        icon: day.icon,
      };
    }),
  };
}

async function getWheatherInformation(
  location,
  unit = "metric",
) {
  try {
    const data = await fetchData(location, unit);
    return cleanData(data);
  } catch (error) {
    console.error("Error en getWheatherInformation:", error.message);
    return { error };
  }
}

;// ./src/content-generator.js
function createElement(tag, ...classList) {
  const element = document.createElement(tag);
  classList.forEach((className) => element.classList.add(className));
  return element;
}

function createIconContainer(iconName) {
  const iconContainer = createElement("div", "icon-container");
  const icon = createElement("div", "icon", iconName);
  iconContainer.appendChild(icon);
  return iconContainer;
}

function createCurrentConditionRow(header, value, ...classList) {
  const tr = createElement("tr");
  const th = createElement("th");
  th.setAttribute("scope", "row");
  th.textContent = header;
  tr.appendChild(th);
  const td = createElement("td", ...classList);
  td.textContent = value;
  tr.appendChild(td);
  return tr;
}

function createForecastHeaderRow(title) {
  const row = createElement("tr");
  const header = createElement("th");
  header.setAttribute("scope", "row");
  header.textContent = title;
  row.appendChild(header);
  return row;
}

function addForecastTableColumn(table, day) {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const date = new Date(day.datetime);
  const rows = table.querySelectorAll("tr");

  const dateCell = createElement("th");
  dateCell.textContent = `${weekday[date.getDay()]} ${date.getDate()}`;
  rows[0].appendChild(dateCell);

  const descriptionCell = rows[1].insertCell();
  descriptionCell.textContent = day.description;

  const tempMaxCell = rows[2].insertCell();
  tempMaxCell.textContent = day.tempmax;
  tempMaxCell.classList.add("temperature");

  const tempMinCell = rows[3].insertCell();
  tempMinCell.textContent = day.tempmin;
  tempMinCell.classList.add("temperature");

  const conditionsCell = rows[4].insertCell();
  const conditionsDiv = createElement("div");
  const conditionsIcon = createIconContainer(day.icon);
  conditionsDiv.appendChild(conditionsIcon);
  const conditionsText = document.createTextNode(day.conditions);
  conditionsDiv.appendChild(conditionsText);
  conditionsCell.appendChild(conditionsDiv);

  const precipitationTypeCell = rows[5].insertCell();
  precipitationTypeCell.textContent = day.preciptype;

  const precipitationProbabilityCell = rows[6].insertCell();
  precipitationProbabilityCell.textContent = day.precipprob;
  precipitationProbabilityCell.classList.add("percentage");
}

function createWeatherContent(data, unit) {
  const container = createElement("div", "weather-container", unit);
  container.classList.add(unit);

  const locationDiv = createElement("div", "location");
  const locationIcon = createIconContainer("location-icon");
  locationDiv.appendChild(locationIcon);
  const selectedLocation = createElement("div", "selected-location");
  selectedLocation.textContent = data.location;
  locationDiv.appendChild(selectedLocation);
  container.appendChild(locationDiv);

  const todayDiv = createElement("div", "today");
  const descriptionDiv = createElement("div", "description");
  descriptionDiv.textContent = data.description;
  todayDiv.appendChild(descriptionDiv);

  const currentConditionsDiv = createElement("div", "current-conditions");
  const currentDescriptionsDiv = createElement("div", "current-descriptions");
  const generalDescriptionDiv = createElement("div", "general-description");
  const currentConditionIcon = createIconContainer(data.currentConditions.icon);
  generalDescriptionDiv.appendChild(currentConditionIcon);

  const temperaturesDiv = createElement("div", "temperatures");
  const temperatureDiv = createElement("div", "temperature");
  temperatureDiv.textContent = data.currentConditions.temp;
  temperaturesDiv.appendChild(temperatureDiv);

  const feelsLikeDiv = createElement("div", "feels-like", "temperature");
  feelsLikeDiv.textContent = `Feels like: ${data.currentConditions.feelslike}`;
  temperaturesDiv.appendChild(feelsLikeDiv);
  generalDescriptionDiv.appendChild(temperaturesDiv);

  currentDescriptionsDiv.appendChild(generalDescriptionDiv);

  const conditionsDiv = createElement("div", "conditions");
  conditionsDiv.textContent = data.currentConditions.conditions;
  currentDescriptionsDiv.appendChild(conditionsDiv);

  const lastUpdateDiv = createElement("div", "last-update");
  lastUpdateDiv.textContent = `Last update: ${data.currentConditions.datetime.substring(0, 5)}`;
  currentDescriptionsDiv.appendChild(lastUpdateDiv);

  currentConditionsDiv.appendChild(currentDescriptionsDiv);

  const currentConditionsTableDiv = createElement(
    "div",
    "current-conditions-table",
  );
  const currentConditionsTable = createElement("table");
  const currentConditionsTableBody = createElement("tbody");

  const tr1 = createCurrentConditionRow(
    "Humidity",
    data.currentConditions.humidity,
    "percentage",
  );
  currentConditionsTableBody.appendChild(tr1);

  const tr2 = createCurrentConditionRow(
    "Dew Point",
    data.currentConditions.dew,
    "temperature",
  );
  currentConditionsTableBody.appendChild(tr2);

  const tr3 = createCurrentConditionRow(
    "Pressure",
    data.currentConditions.pressure,
  );
  currentConditionsTableBody.appendChild(tr3);

  const tr4 = createCurrentConditionRow(
    "Visibility",
    data.currentConditions.visibility,
    "distance",
  );
  currentConditionsTableBody.appendChild(tr4);

  currentConditionsTable.appendChild(currentConditionsTableBody);
  currentConditionsTableDiv.appendChild(currentConditionsTable);
  currentConditionsDiv.appendChild(currentConditionsTableDiv);

  const suncycleDiv = createElement("div", "suncycle");
  const sunDiv = createElement("div", "sun");
  sunDiv.textContent = "Sun";
  suncycleDiv.appendChild(sunDiv);

  const sunriseIconContainer = createIconContainer("sunrise");
  suncycleDiv.appendChild(sunriseIconContainer);

  const sunriseTimeDiv = createElement("div", "sun-time");
  sunriseTimeDiv.textContent = data.currentConditions.sunrise.substring(0, 5);
  suncycleDiv.appendChild(sunriseTimeDiv);

  const sunsetIconContainer = createIconContainer("sunset");
  suncycleDiv.appendChild(sunsetIconContainer);

  const sunsetTimeDiv = createElement("div", "sun-time");
  sunsetTimeDiv.textContent = data.currentConditions.sunset.substring(0, 5);
  suncycleDiv.appendChild(sunsetTimeDiv);

  currentConditionsDiv.appendChild(suncycleDiv);

  todayDiv.appendChild(currentConditionsDiv);
  container.appendChild(todayDiv);

  const forecastDiv = createElement("div", "forecast");
  const forecastHeaderDiv = createElement("div", "forecast-header");
  const forecastTitleDiv = createElement("div", "forecast-title");
  forecastTitleDiv.textContent = "Forecast";
  forecastHeaderDiv.appendChild(forecastTitleDiv);
  forecastDiv.appendChild(forecastHeaderDiv);

  const forecastContainerDiv = createElement("div", "forecast-container");
  const forecastTable = createElement("table");
  const forecastTableBody = createElement("tbody");

  const emptyRowFirst = createElement("tr");
  const emptyCellFirst = createElement("td", "empty-cell");
  emptyCellFirst.setAttribute("rowspan", "2");
  emptyRowFirst.appendChild(emptyCellFirst);
  forecastTableBody.appendChild(emptyRowFirst);

  const empyRowSecond = createElement("tr");
  forecastTableBody.appendChild(empyRowSecond);

  const forecastTableHeaders = [
    "Temp Max",
    "Temp Min",
    "Conditions",
    "Precipitation Type",
    "Precipitation Prob.",
  ];

  forecastTableHeaders.forEach((header) => {
    const headerRow = createForecastHeaderRow(header);
    forecastTableBody.appendChild(headerRow);
  });

  data.days.forEach((day) => {
    addForecastTableColumn(forecastTableBody, day);
  });

  forecastTable.appendChild(forecastTableBody);
  forecastContainerDiv.appendChild(forecastTable);
  forecastDiv.appendChild(forecastContainerDiv);

  container.appendChild(forecastDiv);

  return container;
}

function createErrorContent(error) {
  const container = createElement("div", "error");

  const iconContainer = createIconContainer("error-icon");
  container.appendChild(iconContainer);

  const textContainer = document.createTextNode(error);
  container.appendChild(textContainer);

  return container;
}

function createIndicationsContent() {
  const container = createElement("div", "indications");

  const iconContainer = createIconContainer("information-icon");
  container.appendChild(iconContainer);

  const textContainer = document.createTextNode(
    "You can view the weather data from any city you would like by typing it in the search bar. You can also use the current location button to view the weather data from your current location. In case you use the current location button, please allow the browser to access your location.",
  );
  container.appendChild(textContainer);

  return container;
}

function createLoadingContent() {
  const container = createElement("div", "loading");
  const textNode = document.createTextNode("Loading");
  container.appendChild(textNode);
  const iconContainer = createIconContainer("clear-day");
  container.appendChild(iconContainer);
  return container;
}

;// ./src/render-controller.js


function cleanBodyAndAppendChild(element) {
  const body = document.querySelector(".body");
  body.innerHTML = "";
  body.appendChild(element);
}

function renderData(data, unit) {
  const container = createWeatherContent(data, unit);
  cleanBodyAndAppendChild(container);
}

function renderError(error) {
  const container = createErrorContent(error);
  cleanBodyAndAppendChild(container);
}

function renderIndications() {
  const container = createIndicationsContent();
  cleanBodyAndAppendChild(container);
}

function renderLoading() {
  const container = createLoadingContent();
  cleanBodyAndAppendChild(container);
}

;// ./src/index.js





(function main() {
  function validateForm() {
    console.log("validating", new Date());
    locationInput.setCustomValidity("");
    if (locationInput.value === "") {
      console.log("empty");
      console.log(locationInput);
      locationInput.setCustomValidity("Please enter a location");
      locationInput.reportValidity();

      return false;
    }
    return true;
  }

  function useCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      onLocationSuccess,
      onLocationError,
    );
  }

  function onLocationSuccess(location) {
    const unitInput = document.getElementById("units");
    showLocationWeather(
      `${location.coords.latitude},${location.coords.longitude}`,
      unitInput.value,
    );
  }

  function onLocationError(error) {
    renderError(error.message);
  }

  function submitForm(event) {
    event.preventDefault();

    console.log("submit");
    if (validateForm()) {
      const locationInput = document.getElementById("location");
      const unitInput = document.getElementById("units");
      showLocationWeather(locationInput.value, unitInput.value);
    }
  }

  function showLocationWeather(location, unit = "metric") {
    renderLoading();
    getWheatherInformation(location, unit).then((data) => {
      if ("error" in data) {
        renderError(data.error);
      } else {
        renderData(data, unit);
      }
    });
  }

  const form = document.querySelector("form");
  const locationInput = document.querySelector("#location");
  const currentLocationButton = document.querySelector(
    "#current-location-button",
  );

  form.addEventListener("submit", submitForm);
  locationInput.addEventListener("input", validateForm);
  currentLocationButton.addEventListener("click", useCurrentLocation);

  renderIndications();
})();

/******/ })()
;
//# sourceMappingURL=main.js.map