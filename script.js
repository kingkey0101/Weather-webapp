async function getWeather() {
  console.log('getWeather function called');
  console.log("Forecast div:", document.getElementById("forecast"));

  const cityInput = document.getElementById('cityInput');  
  const city = cityInput.value.trim();
  const apiKey = '4e6c7da88283cc3d8a9a1cadb33e5a86';

  if (!city) {
    return alert("Please enter a city");
  }
  document.getElementById('loadingSpinner').classList.remove('hidden');

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  try {
   
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("City not found");
    }



    const data = await response.json();
    console.log("Weather Data", data);

    displayWeather(data);
    setBackground(data.weather[0].main);

    // Hide the search bar after weather load
    document.querySelector('.search').classList.add('hidden');
    document.querySelector('.weather-info').classList.add('visible');

    // Remove background overlay
    const overlay = document.querySelector('.weather-info-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }

    /* Ensure forecast section is visible and filled */

    const forecastDiv = document.getElementById("forecast");
    forecastDiv.style.display = 'block';

    await getForecast(data.coord.lat, data.coord.lon);

  } catch (error) {
    console.error("Error fetching weather:", error);
    const weatherDiv = document.getElementById("weather");
    weatherDiv.innerHTML = `<p class="error">City not found. Try again.</p>`;
  }
  finally{

    document.getElementById('loadingSpinner').classList.add('hidden');
  }

// dynamic backgrounds
  function setBackground(weatherMain) {
    if (weatherMain === "Clear") {
      document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80')";
    } else if (weatherMain === "Rain") {
      document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1400&q=80')";
    } else if (weatherMain === "Clouds") {
      document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1527766833261-b09c3163a791?auto=format&fit=crop&w=1400&q=80')";
    } else {
      document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80')";
    }
  
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.transition = "background-image 0.5s ease-in-out";
  }
  
}

function displayWeather(data) {
  const weatherDiv = document.getElementById('weather');
  const overlay = document.querySelector('.weather-info-overlay');

  weatherDiv.classList.remove('visible');
  void weatherDiv.offsetWidth; // Force reflow

  // check if weatherDiv is null to make sure element exists
  if (!weatherDiv) {
    console.error('Weather div not found!')
    return;
  }

  weatherDiv.innerHTML = `
    <h2>${data.name}</h2>
    <div class="weather-details">
       <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon">
       <div class="weather-info-text">
       <p>${data.weather[0].description.toUpperCase()}</p>
    <p>Temperature: ${data.main.temp}°F</p>
    <p>Feels Like: ${data.main.feels_like}°F</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind Speed: ${data.wind.speed} mph</p>
    <p>Weather: ${data.weather[0].description}</p>
    </div>
    </div>
  `;

 

  weatherDiv.classList.add('visible');
  overlay.style.display = 'flex';
}

 

function setBackground(weatherMain) {
  if (weatherMain === "Clear") {
    document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80')";
  } else if (weatherMain === "Rain") {
    document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1400&q=80')";
  } else if (weatherMain === "Clouds") {
    document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1527766833261-b09c3163a791?auto=format&fit=crop&w=1400&q=80')";
  } else {
    document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80')";
  }

  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.transition = "background-image 0.5s ease-in-out";
}



document.getElementById("getWeatherButton").addEventListener("click", getWeather);

async function getForecast(lat, lon) {
  const apiKey = '4e6c7da88283cc3d8a9a1cadb33e5a86'
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

  try {
    const res = await fetch(forecastUrl);
    const data = await res.json();

    const forecastDiv = document.getElementById("forecast");
    console.log("Clearint forecast")
    forecastDiv.innerHTML = "";

    const daily ={};

    data.list.forEach(item => {
      const date = item.dt_txt.split(" ")[0];
      if (!daily[date] && item.dt_txt.includes("12:00:00")){
        daily[date] = item;
      }
    });

    Object.keys(daily).slice(0, 5).forEach(date =>{
      const item = daily[date];
      const day = new Date(item.dt_txt).toLocaleDateString('en-US',{ weekday: 'short'});
      const icon = item.weather[0].icon;
      const temp =Math.round(item.main.temp);
      const description = item.weather[0].main;

      forecastDiv.innerHTML += `
      <div class="forecast-day">
      <h4>${day}<h4>
       <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" />
       <p>${temp}°F</p>
       <small>${description}</small>
       </div>
       `;
    });
  } catch (error){
    console.error("Error fetching forecast:", error);
  }

  
}

window.onload = () => document.getElementById('cityInput').focus();

document.getElementById('cityInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') getWeather();
} );
