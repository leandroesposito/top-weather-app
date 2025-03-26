import {
  createWeatherContent,
  createErrorContent,
  createIndicationsContent,
} from "./content-generator";

function cleanBodyAndAppendChild(element) {
  const body = document.querySelector(".body");
  body.innerHTML = "";
  body.appendChild(element);
}

export function renderData(data, unit) {
  const container = createWeatherContent(data, unit);
  cleanBodyAndAppendChild(container);
}

export function renderError(error) {
  const container = createErrorContent(error);
  cleanBodyAndAppendChild(container);
}

export function renderIndications() {
  const container = createIndicationsContent();
  cleanBodyAndAppendChild(container);
}
