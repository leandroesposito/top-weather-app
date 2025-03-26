import { createWeatherContent } from "./content-generator";

export function renderData(data, unit) {
  const body = document.querySelector(".body");
  body.innerHTML = "";

  const container = createWeatherContent(data, unit);

  body.appendChild(container);
}
