const API_KEY = "YOUR_API_KEY";
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

// Search button click
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
    

    const data = await response.json();

    if (data.cod !== 200) {
      throw new Error(data.message);
    }

    displayWeather(data);
    hideError();

  } catch (error) {
    showError("City not found");
  }
}

// Display weather data
function displayWeather(data) {

  tempValue.textContent = Math.round(data.main.temp);
  weatherDesc.textContent = data.weather[0].description;
  humidity.textContent = `${data.main.humidity}%`;
  wind.textContent = `${data.wind.speed} km/h`;
  locationText.textContent = `${data.name}, ${data.sys.country}`;

  // High quality icon
  const iconCode = data.weather[0].icon;
  weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

  weatherInfo.classList.add("active");
}

// Error display
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add("active");
  weatherInfo.classList.remove("active");
}

function hideError() {
  errorMessage.classList.remove("active");
}

// Auto location weather
navigator.geolocation.getCurrentPosition(async position => {

  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  try {
    const response = await fetch(
      `${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();
    displayWeather(data);

  } catch (error) {
    console.log("Location weather not available");
  }

});

