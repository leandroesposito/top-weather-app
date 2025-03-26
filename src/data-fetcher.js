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

export default async function getWheatherInformation(
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
