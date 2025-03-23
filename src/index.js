import "./style.css";
import getWheatherInformation from "./data-fetcher";

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
})();
