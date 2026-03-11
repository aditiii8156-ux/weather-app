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


// Dark mode toggle
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});


// Search button
searchBtn.addEventListener("click", getWeather);


// Enter key search
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getWeather();
  }
});


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

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();
    displayWeather(data);
    hideError();

  } catch (error) {
    showError(error.message);
  }
}


// Display weather
function displayWeather(data) {

  tempValue.textContent = Math.round(data.main.temp);
  weatherDesc.textContent = data.weather[0].description;
  humidity.textContent = `${data.main.humidity}%`;
  wind.textContent = `${data.wind.speed} km/h`;
  locationText.textContent = `${data.name}, ${data.sys.country}`;

  const iconCode = data.weather[0].icon;
  weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

  weatherInfo.classList.add("active");
}


// Show error
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add("active");
  weatherInfo.classList.remove("active");
}


function hideError() {
  errorMessage.classList.remove("active");
}


// Auto-location weather
navigator.geolocation.getCurrentPosition(async (position) => {

  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  try {

    const response = await fetch(
      `${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error("Location weather not available");
    }

    const data = await response.json();
    displayWeather(data);

  } catch (error) {
    console.log(error.message);
  }

});
