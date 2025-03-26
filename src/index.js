import "./style.css";
import "./icons.css";
import getWheatherInformation from "./data-fetcher";
import {
  renderData,
  renderIndications,
  renderError,
  renderLoading,
} from "./render-controller";

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
