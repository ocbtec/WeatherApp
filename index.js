//  SERVER ********************************************

function callAPI(city) {
  let url = `https://api.openweathermap.org/data/2.5/forecast?q=`;
  const apiKey = `&APPID=d84a3b5a1d8ffa8e702549aec5e6ec79`;
  let forecast = url + city + "&units=metric" + apiKey;

  return axios.get(forecast);
}

//  /SERVER ********************************************

//  CLIENT ********************************************
class WeatherData {
  constructor(city_input) {
    this.city_input = city_input;
    this.data = "";
    this.use_metric = true;
    this.monthArray = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
  }
  // get month and day
  getDate(num) {
    let tmpDate = this.data.list[num].dt_txt.slice(5, 10);
    num = tmpDate.slice(3, 5);
    let month = this.monthArray[tmpDate.slice(0, 2) - 1];
    return `${month} ${num}`;
  }
  // get current temperature
  getTemp(num) {
    let temp = this.data.list[num].main.temp;
    if (this.use_metric === true) {
      return temp;
    } else {
      return celsius_to_fahrenheit(temp);
    }
  }
  // get feels-like-temperature
  getFeelsLikeTemp(num) {
    let temp = this.data.list[num].main.feels_like;
    if (this.use_metric === true) {
      return temp;
    } else {
      return celsius_to_fahrenheit(temp);
    }
  }
  // get min-temperature
  getTempMin(num) {
    let temperatures = num;
    let temp_values = [];
    let temp;

    if (num != 0) {
      for (let i = 0; i < 8; i++) {
        temp_values.push(this.data.list[temperatures].main.temp_min);
        temperatures--;
      }
      temp = Math.min(...temp_values);
    } else {
      let day = num;
      temp = this.data.list[0].main.temp_min;
    }
    if (this.use_metric === true) {
      return temp;
    } else {
      return celsius_to_fahrenheit(temp);
    }
  }
  // get max-temperature
  getTempMax(num) {
    let temperatures = num;
    let temp_values = [];
    let temp;

    if (num != 0) {
      for (let i = 0; i < 8; i++) {
        temp_values.push(this.data.list[temperatures].main.temp_max);

        temperatures--;
      }
      temp = Math.max(...temp_values);
    } else {
      let day = num;
      temp = this.data.list[0].main.temp_max;
    }
    if (this.use_metric === true) {
      return temp;
    } else {
      return celsius_to_fahrenheit(temp);
    }
  }
  // get weather description
  getOvercast(num) {
    let temp = this.data.list[num].weather[0].description;
    return temp;
  }
  // get wind speed
  getWind(num) {
    // TODO: changes from m/s to mph
    let temp = this.data.list[num].wind.speed;
    if (this.use_metric) {
      return temp;
    } else {
      return meter_per_second_to_miles_per_hour(temp);
    }
  }
  // get humidity
  getHumidity(num) {
    let temp = this.data.list[num].main.humidity;
    return temp;
  }
  // get icon accordingly to weather
  getIcon(num) {
    let icon = this.data.list[num].weather[0].icon;
    return icon;
  }
  formatCityString() {
    return `${this.data.city.name}, ${this.data.city.country}`;
  }
}

// set mobile layout to standard (keyboard closed)
const mobile_layout = () => {
  let slide_container = document.getElementById("slide-container");
  slide_container.style.display = "block";
};

const evaluate_promise = p => {
  p.then(response => {
    weather_data.data = response.data;
    writeDataToDom();
  }).catch(error => {
    let error_msg_box = document.getElementById("not_found_container");
    error_msg_box.style.display = "flex";

    let city_input = document.getElementById("city-input");
    city_input.value = weather_data.formatCityString();

    document.addEventListener("click", () => {
      error_msg_box.style.display = "none";
    });
  });
};

const celsius_to_fahrenheit = tempCelsius => {
  return tempCelsius * 1.8 + 32;
};
const meter_per_second_to_miles_per_hour = meter_per_second => {
  return meter_per_second * 2.237;
};

const writeDataToDom = () => {
  // for delay when displaying weather data
  let refresh_time = 1000;

  // write current temp to dom
  let temp = document.getElementById("temp-value");
  let temp_string = weather_data.getTemp(0).toFixed(1);
  setTimeout(() => {
    temp.innerHTML = temp_string;
  }, refresh_time);

  // write temp unit accordingly to choice to dom
  let temp_symbol = document.getElementById("temp-symbol");
  temp_symbol.style.color = "#cccccc";
  setTimeout(() => {
    if (weather_data.use_metric) {
      temp_symbol.innerHTML = " °C";
    } else {
      temp_symbol.innerHTML = " °F";
    }
  }, refresh_time);

  // write feels-like-temp to dom
  let feels_like_temp = document.getElementById("feels-like-temp");
  let feels_like_temp_string = weather_data.getFeelsLikeTemp(0).toFixed(1);
  setTimeout(() => {
    feels_like_temp.innerHTML = `Feels like <span id="feels-like-temp-value">${feels_like_temp_string}°</span>`;
  }, refresh_time + 50);

  // write min and max temp to dom
  let temp_min = document.getElementById("temp_min");
  let temp_min_string = weather_data.getTempMin(0).toFixed(1);
  let temp_max = document.getElementById("temp_max");
  let temp_max_string = weather_data.getTempMax(0).toFixed(1);
  setTimeout(() => {
    temp_min.innerHTML = `${temp_min_string}° <span id="temp-min-span">Min</span>`;
    document.getElementById("temp-min-span").style.cssText =
      "color: #6ca1d0; text-shadow: 1px 1px 1px #616161;";
    temp_max.innerHTML = `${temp_max_string}° <span id="temp-max-span">Max</span> `;
    document.getElementById("temp-max-span").style.cssText =
      "color: #b94848; text-shadow: 1px 1px 1px #616161;";
  }, refresh_time + 100);

  // write weather description to dom
  let overcast = document.getElementById("overcast");
  setTimeout(() => {
    overcast.innerHTML = weather_data.getOvercast(0);
  }, refresh_time + 110);

  // write wind speed to dom
  let wind = document.getElementById("wind");
  setTimeout(() => {
    wind.innerHTML = `Wind: ${weather_data.getWind(0).toFixed(1)} ${
      weather_data.use_metric ? `m/s` : "mph"
    }`;
  }, refresh_time + 115);

  // write humidity temp to dom
  let humidity = document.getElementById("humidity");
  setTimeout(() => {
    humidity.innerHTML = `Humidity: ${weather_data.getHumidity(0)}%`;
  }, refresh_time + 120);

  // use last city as fallback for input field
  let country = weather_data.data.city.country;
  if (weather_data.city_input !== undefined) {
    weather_data.city_input.value = `${
      weather_data.city_input == undefined
        ? "Berlin"
        : weather_data.data.city.name
    }, ${country}`;
  }

  // write icon to dom
  setTimeout(() => {
    let image = document.getElementById("icon");
    image.style.display = "inline-block";
    let downloadingImage = new Image();
    downloadingImage.onload = function() {
      image.src = this.src;
    };
    downloadingImage.src = `https://openweathermap.org/img/wn/${weather_data.getIcon(
      0
    )}@2x.png`;
  }, refresh_time);

  // weather forecast for tomorrow
  setTimeout(() => {
    document.getElementById(
      "day-2-temp-min"
    ).innerHTML = `${weather_data.getTempMin(7).toFixed(1)}°`;
    document.getElementById(
      "day-2-temp-max"
    ).innerHTML = `${weather_data.getTempMax(7).toFixed(1)}°`;
    document.getElementById("day-2-date").innerHTML = weather_data.getDate(7);
    document.getElementById(
      "day-2-icon"
    ).src = `https://openweathermap.org/img/wn/${weather_data.getIcon(
      7
    )}@2x.png`;

    // weather forecast for 2nd day
    document.getElementById(
      "day-3-temp-min"
    ).innerHTML = `${weather_data.getTempMin(15).toFixed(1)}°`;
    document.getElementById(
      "day-3-temp-max"
    ).innerHTML = `${weather_data.getTempMax(15).toFixed(1)}°`;
    document.getElementById("day-3-date").innerHTML = weather_data.getDate(15);
    document.getElementById(
      "day-3-icon"
    ).src = `https://openweathermap.org/img/wn/${weather_data.getIcon(
      15
    )}@2x.png`;

    // weather forecast for 3nd day
    document.getElementById(
      "day-4-temp-min"
    ).innerHTML = `${weather_data.getTempMin(23).toFixed(1)}°`;
    document.getElementById(
      "day-4-temp-max"
    ).innerHTML = `${weather_data.getTempMax(23).toFixed(1)}°`;
    document.getElementById("day-4-date").innerHTML = weather_data.getDate(23);
    document.getElementById(
      "day-4-icon"
    ).src = `https://openweathermap.org/img/wn/${weather_data.getIcon(
      23
    )}@2x.png`;

    // weather forecast for 4nd day
    document.getElementById(
      "day-5-temp-min"
    ).innerHTML = `${weather_data.getTempMin(31).toFixed(1)}°`;
    document.getElementById(
      "day-5-temp-max"
    ).innerHTML = `${weather_data.getTempMax(31).toFixed(1)}°`;
    document.getElementById("day-5-date").innerHTML = weather_data.getDate(31);
    document.getElementById(
      "day-5-icon"
    ).src = `https://openweathermap.org/img/wn/${weather_data.getIcon(
      31
    )}@2x.png`;

    // weather forecast for 5nd day
    document.getElementById(
      "day-6-temp-min"
    ).innerHTML = `${weather_data.getTempMin(39).toFixed(1)}°`;
    document.getElementById(
      "day-6-temp-max"
    ).innerHTML = `${weather_data.getTempMax(39).toFixed(1)}°`;
    document.getElementById("day-6-date").innerHTML = weather_data.getDate(39);
    document.getElementById(
      "day-6-icon"
    ).src = `https://openweathermap.org/img/wn/${weather_data.getIcon(
      39
    )}@2x.png`;
  }, refresh_time + 120);

  // start circle animation
  setTimeout(() => {
    document.getElementById("turning_circle").classList.add("turn");
  }, 300);
  // remove circle animation
  let animate_circle = document.getElementById("turning_circle");
  animate_circle.addEventListener("animationend", () => {
    animate_circle.classList.remove("turn");
  });

  // write current city to input field
  let city_input = document.getElementById("city-input");
  city_input.value = weather_data.formatCityString();

  // hide mobile keyboard after input
  let input = document.getElementById("city-input");
  input.blur();

  // set mobile layout to standard (keyboard closed)
  mobile_layout();
};

let weather_data = new WeatherData("Berlin");
let p = callAPI("Berlin");
evaluate_promise(p);
let city_input = document.getElementById("city-input");

const newCity = (city_input) => {
  if (city_input.value != "") {
    let p = callAPI(city_input.value);
    evaluate_promise(p);
  }
}

document.querySelector("#city-input").addEventListener("keypress", function(e) {
  let key = e.which || e.keyCode;
  if (key === 13) {
    newCity(city_input);
  }
});

const getCity = () => {
  newCity(city_input);
}


// change units to metric
let celsius = document.getElementById("celsius");
let imperial = document.getElementById("imperial");
celsius.addEventListener("click", () => {
  weather_data.use_metric = true;
  celsius.classList.add("buttonOn");
  imperial.classList.add("buttonOff");
  celsius.classList.remove("buttonOff");
  imperial.classList.remove("buttonOn");
  writeDataToDom();
});
// change units to imperial
imperial.addEventListener("click", () => {
  weather_data.use_metric = false;
  imperial.classList.add("buttonOn");
  celsius.classList.add("buttonOff");
  imperial.classList.remove("buttonOff");
  celsius.classList.remove("buttonOn");
  writeDataToDom();
});

//  /CLIENT ********************************************
