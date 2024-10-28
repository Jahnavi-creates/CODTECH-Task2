const app = document.querySelector(".weather-app");
const temp = document.querySelector(".temp");
const dateOutput = document.querySelector(".date");
const timeOutput = document.querySelector(".time");
const conditionOutput = document.querySelector(".condition");
const nameOutput = document.querySelector(".name");
const icon = document.querySelector(".icon");
const cloudOutput = document.querySelector(".cloud");
const humidityOutput = document.querySelector(".humidity");
const windOutput = document.querySelector(".wind");
const form = document.getElementById("locationInput"); // Removed the dot
const search = document.querySelector(".search");
const btn = document.querySelector(".submit");
const cities = document.querySelectorAll(".city");

// Default city when the page loads
let cityInput = "London";

// Add click event to each city in the panel
cities.forEach((city) => {
  city.addEventListener("click", (e) => {
    cityInput = e.target.innerHTML;
    fetchWeatherData();
    // Fade out the app (simple animation)
    app.style.opacity = "0";
  });
});

// Add submit event to the form
form.addEventListener("submit", (e) => {
  if (search.value.length === 0) {
    alert("Please type in a city name");
  } else {
    // Change from default city to the one written in the input field
    cityInput = search.value;
    fetchWeatherData();
    // Remove all text from the input field
    search.value = "";
    // Fade out the app (simple animation)
    app.style.opacity = "0";
  }
  // Prevents the default behavior of the form
  e.preventDefault();
});

function dayOfTheWeek(day, month, year) {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekday[new Date(`${year}-${month}-${day}`).getDay()]; // Corrected date format
}

/* Function that fetches and displays the data from the weather API */
function fetchWeatherData() {
  // Fetch the data and dynamically add the city name with template literals
  fetch(
    `http://api.weatherapi.com/v1/current.json?key=f7fc6d75cb0b45dea3760129242510&q=${cityInput}`
  )
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      console.log(data); // Log the data to see what is available

      // Populate the weather details
      temp.innerHTML = `${data.current.temp_c}°`;
      conditionOutput.innerHTML = data.current.condition.text;

      // Get date and time from the API
      const date = data.location.localtime;
      const y = parseInt(date.substr(0, 4));
      const m = parseInt(date.substr(5, 2));
      const d = parseInt(date.substr(8, 2));
      const time = date.substr(11);

      // Reformat the date into something more appealing
      dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m} ${y}`;
      timeOutput.innerHTML = time;

      // Add the name of the city to the page
      nameOutput.innerHTML = data.location.name;

      // Get the icon URL
      const iconId = data.current.condition.icon.substr(
        "//cdn.weatherapi.com/weather/64x64/".length
      );
      icon.src = `./icons/${iconId}`;

      // Add the weather details to the page
      cloudOutput.innerHTML = `${data.current.cloud}%`;
      humidityOutput.innerHTML = `${data.current.humidity}%`;
      windOutput.innerHTML = `${data.current.wind_kph} km/h`;

      let timeOfDay = "day"; // Default time of day
      const code = data.current.condition.code; // Weather code

      // Change to night if it's night time in the city
      if (!data.current.is_day) {
        timeOfDay = "night";
      }

      // Set background images based on weather conditions
      if (code == 1000) {
        app.style.backgroundImage = `url(./images/${timeOfDay}/clear.jpg)`;
        btn.style.background = "#e5ba92";
      } else if (
        [
          1003, 1006, 1009, 1030, 1069, 1087, 1135, 1273, 1276, 1279, 1282,
        ].includes(code)
      ) {
        app.style.backgroundImage = `url(./images/${timeOfDay}/cloudy.jpg)`;
        btn.style.background = "#fa6d1b";
      } else if (
        [
          1063, 1069, 1072, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195,
          1204, 1207, 1240, 1243, 1246, 1249, 1252,
        ].includes(code)
      ) {
        app.style.backgroundImage = `url(./images/${timeOfDay}/rainy.jpg)`;
        btn.style.background = "#647d75";
      } else {
        app.style.backgroundImage = `url(./images/${timeOfDay}/snowy.jpg)`;
        btn.style.background = "#4d72aa";
      }

      // Fade in the page once all is done
      app.style.opacity = "1";
    })
    .catch(() => {
      alert("City not found, please try again");
      app.style.opacity = "1";
    });
}

// Call the function on page load
fetchWeatherData();
