const BASE_URL_1 = 'https://api.geoapify.com/v1/geocode/search?filter=countrycode:in&state=';
const BASE_URL_1_part2 = '&format=json&apiKey=d548c5ed24604be6a9dd0d989631f783';

const day = document.querySelector("#day");
const container = document.querySelector(".content");
const img = document.querySelector(".degree img");
const date = document.querySelector(".date");
const input = document.querySelector("#text");
const drop = document.querySelector(".search select");

for(code of indianCities) {
    let option = document.createElement("option");
    option.value = code.toLowerCase();
    option.innerText = code;
    drop.append(option);
}

function search() {
    if(input.value.trim() !== '' && input.value.trim() !== '#') {
        const loaction = document.querySelector(".content h1");
        const loaction1 = document.querySelector(".location");

        loaction.textContent = input.value.charAt(0).toUpperCase() + input.value.slice(1);
        loaction1.textContent = input.value.charAt(0).toUpperCase() + input.value.slice(1);
        updateWeather(input.value);
    }
}
const updateWeather = async (value) => {
    try {
        let URL1 = `${BASE_URL_1}${value}${BASE_URL_1_part2}`;
        let response = await fetch(URL1);
        let data = await response.json();

        let lat = data.results[0].lat;
        let lon = data.results[0].lon;
        console.log(lat, " ",lon);
        const BASE_URL_TEMP = `https://api.open-meteo.com/v1/forecast?&forecast_days=2&latitude=${lat.toFixed(2)}&longitude=${lon.toFixed(2)}&hourly=temperature_2m&hourly=wind_speed_10m&hourly=precipitation&hourly=relative_humidity_2m&hourly=weathercode`;

        let currentTime = await getCurrentTimeFromAPI(lat, lon);
        currentTime = currentTime.slice(0, 13) + ":00";

        let response1 = await fetch(BASE_URL_TEMP);
        let data1 = await response1.json();

        const timeIndex = data1.hourly.time.findIndex((time) => time === currentTime);
        if (timeIndex === -1) {
            alert("No Connection! Make sure to connect to an Internet");
            return;
        }
        let stateIndex = data1.hourly.weathercode[timeIndex];
        let time1 = currentTime.slice(11,13);
        time1 = parseInt(time1);
        await changeState(time1,stateIndex);


        const humidity = document.getElementById("humi");
        const precipt = document.getElementById("preci");
        const wind = document.getElementById("wind");
        const Temperatur = document.querySelector(".cel");
        const state = document.querySelector(".state");

        humidity.innerHTML = `Humidity: ${data1.hourly.relative_humidity_2m[timeIndex]}%`;
        precipt.innerHTML = `Precipitation: ${data1.hourly.precipitation[timeIndex]}%`;
        Temperatur.innerHTML =  `${parseInt(data1.hourly.temperature_2m[timeIndex])}°C`;
        wind.textContent = `Wind Speed: ${data1.hourly.wind_speed_10m[timeIndex]}km/h`;

        state.innerText = weatherConditions[stateIndex];
    } catch (error) {
        alert("No Connection! Make sure to connect to an Internet");
        throw error;
    }
};

const getCurrentTimeFromAPI = async (lat,lon) => {
    try {
        const response = await fetch(`https://timeapi.io/api/time/current/coordinate?latitude=${lat.toFixed(2)}&longitude=${lon.toFixed(2)}`);
        const data = await response.json();
        const currentTime = data.dateTime;
        let useCT = currentTime;
        date.innerText =`${useCT.slice(0,10)} |`;
        day.innerText = data.dayOfWeek;
        return currentTime;
    } catch (error) {
        alert("No Connection! Make sure to connect to an Internet");
        throw error;
    }
};
const changeState = async (time1, stateIndex) => {
    if ((time1 >= 20 && time1 <= 23) || (time1 >= 0 && time1 <= 7)) {
        container.style.backgroundImage = "url('moon.jpeg')";
        container.style.backgroundSize = "cover";
        container.style.backgroundRepeat = "no-repeat";
        container.style.backgroundPosition = "center";
        img.src = 'night2.png';
    } else if (stateIndex === 0 || stateIndex === 1) {
        img.classList.add("hide");
        container.style.backgroundImage = "url('clearsky2.jpg')";
        container.style.backgroundSize = "cover";
        container.style.backgroundRepeat = "no-repeat";
        container.style.backgroundPosition = "center";
    } else if (stateIndex === 2 || stateIndex === 3) {
        img.classList.add("hide");
        container.style.backgroundImage = "url('partly.jpg')";
        container.style.backgroundSize = "cover";
        container.style.backgroundRepeat = "no-repeat";
        container.style.backgroundPosition = "center";
    } else if (stateIndex === 45 || stateIndex === 48 || stateIndex === 51 || stateIndex === 53 || stateIndex === 55) {
        container.style.backgroundImage = "url('fog.png')";
        container.style.textShadow = "3px 5px 8px black";
        container.style.backgroundSize = "cover";
        container.style.backgroundRepeat = "no-repeat";
        container.style.backgroundPosition = "center";
    } else if (stateIndex === 95 || stateIndex === 96 || stateIndex === 99) {
        img.src = "thunder.png";
        container.style.backgroundImage = "url('thunder.jpg')";
        container.style.backgroundSize = "cover";
        container.style.backgroundRepeat = "no-repeat";
        container.style.backgroundPosition = "center";
    } else if (stateIndex === 61 || stateIndex === 63) {
        img.src = "littlerain.jpg";
        container.style.backgroundImage = "url('littlerainback.jpeg')";
        container.style.backgroundSize = "cover";
        container.style.backgroundRepeat = "no-repeat";
        container.style.backgroundPosition = "center";
    } else {
        img.src = "rain.jpg";
        container.style.backgroundImage = "url('heavyrainback.jpeg')";
        container.style.backgroundSize = "cover";
        container.style.backgroundRepeat = "no-repeat";
        container.style.backgroundPosition = "center";
    }
};
