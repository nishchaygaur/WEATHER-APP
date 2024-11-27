document.addEventListener("DOMContentLoaded", function () {
    const weatherPage = document.getElementById('weather');
    const environmentalPage = document.getElementById('environmental');
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');

            if (targetId === 'environmental') {
                updateEnvironmentalData(document.getElementById('city').value);
            }
        });
    });

    document.getElementById('city').addEventListener('input', function () {
        var city = this.value;
        getWeather(city);
        if (environmentalPage.classList.contains('active')) {
            updateEnvironmentalData(city);
        }
    });

    getWeather('Delhi');
    setInterval(() => getWeather(document.getElementById('city').value), 900000);
});

async function getWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=54a57bc234ad752a4f59e59cd372201d&units=metric`);
        const data = await response.json();

        updateWeatherUI(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function updateWeatherUI(data) {
    const currentWeather = data.list[0];
    const dailyForecasts = data.list.filter((item, index) => index % 8 === 0);

    document.querySelector('.weather-temp').textContent = `${Math.round(currentWeather.main.temp)}°C`;
    document.querySelector('.date-dayname').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    document.querySelector('.date-day').textContent = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    document.querySelector('.location').textContent = data.city.name;
    document.querySelector('.weather-desc').textContent = currentWeather.weather[0].description;

    document.querySelector('.humidity .value').textContent = `${currentWeather.main.humidity}%`;
    document.querySelector('.wind .value').textContent = `${currentWeather.wind.speed} m/s`;

    const weatherIcon = document.querySelector('.weather-icon');
    weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png" alt="${currentWeather.weather[0].description}">`;

    const weekList = document.querySelector('.week-list');
    weekList.innerHTML = '';

    dailyForecasts.forEach((forecast, index) => {
        const li = document.createElement('li');
        const date = new Date(forecast.dt * 1000);
        li.innerHTML = `
            <span class="day-name">${date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
            <span class="day-temp">${Math.round(forecast.main.temp)}°C</span>
            <span class="day-icon">
                <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">
            </span>
        `;
        if (index === 0) li.classList.add('active');
        weekList.appendChild(li);
    });
}

function updateEnvironmentalData(city) {
    document.getElementById('env-city').textContent = city;

    // Simulated environmental data (replace with actual API call in a real application)
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Air Quality Index',
            data: [50, 55, 60, 58, 62, 65].map(value => value + Math.floor(Math.random() * 20 - 10)),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }, {
            label: 'CO2 Levels (ppm)',
            data: [410, 412, 415, 418, 420, 422].map(value => value + Math.floor(Math.random() * 10 - 5)),
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1
        }]
    };

    const ctx = document.getElementById('environmentalChart').getContext('2d');
    if (window.environmentalChart instanceof Chart) {
        window.environmentalChart.destroy();
    }
    window.environmentalChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `Environmental Trends for ${city}`
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    updateAlerts(city);
    updateEducationalResources();
}

function updateAlerts(city) {
    // Simulated alerts (replace with actual API call in a real application)
    const alerts = [
        { severity: 'high', message: `High levels of air pollution detected in ${city}. Please stay indoors if possible.` },
        { severity: 'medium', message: 'Moderate UV levels expected. Use sun protection when outdoors.' },
        { severity: 'low', message: 'Pollen count is slightly elevated. Take precautions if you have allergies.' }
    ];

    const alertsList = document.getElementById('alertsList');
    alertsList.innerHTML = '';

    alerts.forEach(alert => {
        const li = document.createElement('li');
        li.textContent = alert.message;
        li.classList.add(alert.severity);
        alertsList.appendChild(li);
    });
}

function updateEducationalResources() {
    const resources = [
        { title: 'Understanding Air Quality Index', url: 'https://www.airnow.gov/aqi/aqi-basics/' },
        { title: 'How to Reduce Your Carbon Footprint', url: 'https://www.nature.org/en-us/get-involved/how-to-help/carbon-footprint-calculator/' },
        { title: 'The Importance of Biodiversity', url: 'https://www.un.org/en/observances/biological-diversity-day/background' }
    ];

    const resourcesList = document.getElementById('resourcesList');
    resourcesList.innerHTML = '';

    resources.forEach(resource => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = resource.url;
        a.textContent = resource.title;
        a.target = '_blank';
        li.appendChild(a);
        resourcesList.appendChild(li);
    });
}
