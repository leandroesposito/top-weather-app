import "./style.css";
import getWheatherInformation from "./data-fetcher";
import { renderData } from "./render-controller";
import sampleData from "./sample-data";

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

  function showError(error) {
    console.error(error);
  }

  function showWeatherData(data) {
    console.log(data);
  }

  function submitForm(event) {
    event.preventDefault();

    console.log("submit");
    if (validateForm()) {
      const locationInput = document.getElementById("location");
      showLocationWeather(locationInput.value);
    }
  }

  function showLocationWeather(location) {
    getWheatherInformation(location).then((data) => {
      if ("error" in data) {
        showError(data.error);
      } else {
        showWeatherData(data);
      }
    });
  }

  const form = document.querySelector("form");
  const locationInput = document.querySelector("#location");

  form.addEventListener("submit", submitForm);
  locationInput.addEventListener("input", validateForm);
  document
    .querySelector("#current-location-button")
    .addEventListener("click", () => {
      renderData(sampleData, "metric");
    });
})();

(function () {
  const promise = getWheatherInformation("Westport ireland", "metric");
  console.log(promise);
  promise
    .then((data) => {
      if ("error" in data) {
        console.error(data.error);
      } else {
        console.log("Datos recibidos:", data);
      }
    })
    .catch((error) => {
      console.log("Error capturado en el último catch:", error.message);
    });
});
