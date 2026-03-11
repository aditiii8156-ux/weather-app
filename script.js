const API_KEY = "d7fd3a821a40a3bb8866ce5b341a510f";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const weatherInfo = document.getElementById("weather-info");
const tempValue = document.getElementById("temp-value");
const weatherDesc = document.getElementById("weather-desc");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const locationText = document.getElementById("location");
const errorMessage = document.getElementById("error-message");
const weatherIcon = document.getElementById("weather-icon");
const toggleBtn = document.getElementById("theme-toggle");


// DARK MODE
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });
}


// SEARCH BUTTON
searchBtn.addEventListener("click", getWeather);


// ENTER KEY SEARCH
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getWeather();
  }
});


// FETCH WEATHER
async function getWeather() {

  const city = cityInput.value.trim();

  if (!city) {
    showError("Please enter a city name");
    return;
  }

  try {

    const response = await fetch(
      `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();

    if (data.cod != 200) {
      showError(data.message || "City not found");
      return;
    }

    displayWeather(data);
    hideError();

  } catch (error) {

    showError("Unable to fetch weather");

  }

}


// DISPLAY WEATHER
function displayWeather(data) {

  tempValue.textContent = Math.round(data.main.temp);
  weatherDesc.textContent = data.weather[0].description;
  humidity.textContent = `${data.main.humidity}%`;
  wind.textContent = `${data.wind.speed} km/h`;
  locationText.textContent = `${data.name}, ${data.sys.country}`;

  if (weatherIcon) {
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  }

  weatherInfo.classList.add("active");

}


// SHOW ERROR
function showError(message) {

  errorMessage.textContent = message;
  errorMessage.classList.add("active");
  weatherInfo.classList.remove("active");

}


// HIDE ERROR
function hideError() {

  errorMessage.classList.remove("active");

}


// AUTO LOCATION WEATHER
if (navigator.geolocation) {

  navigator.geolocation.getCurrentPosition(

    async (position) => {

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {

        const response = await fetch(
          `${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();

        if (data.cod == 200) {
          displayWeather(data);
        }

      } catch {

        console.log("Location weather not available");

      }

    },

    () => {
      console.log("Location permission denied");
    }

  );

}
