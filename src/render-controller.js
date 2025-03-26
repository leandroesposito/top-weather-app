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

export function renderData(data, unit) {
  const body = document.querySelector(".body");
  body.innerHTML = "";

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

  //table
  //suncycle

  todayDiv.appendChild(currentConditionsDiv);
  container.appendChild(todayDiv);

  body.appendChild(container);
}
