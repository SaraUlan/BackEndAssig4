$(document).ready(function () {
  $("#getWeatherBtn").on("click", () => {
    var city = $("#cityInput").val();
    console.log(city);
    var data = {
      city: city,
    };
    $.ajax({
      type: "GET",
      url: "/api/forecast",
      data: data,
      success: function (response) {
        console.log("weather retrived successful");
        console.log(response);
        displayweather(response);
      },
      error: function (xhr, status, error) {
        console.error("Error occurred while getting weather");
        console.error(xhr.responseText);
        const response = JSON.parse(xhr.responseText);
      },
    });
  });

  function displayweather(response) {
    var weatherInfo = document.getElementById("weatherInfo");
    var cardHtml = `
          <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">weather in  ${response.city} , ${
      response.country
    } </h5>
              <p class="card-text">Temperature:  ${response.temperature} °F</p>
              <p class="card-text">Feels Like:  ${response.feelsLike} °F</p>
              <p class="card-text">Humidity:  ${response.humidity} %</p>
              <p class="card-text">Wind Speed:  ${response.windSpeed}  m/s</p>
              <p class="card-text">Condition:  ${response.condition} </p>
              <p class="card-text">Description:  ${
                response.weatherDescription
              } </p>
              <p class="card-text">Sunrise:  ${new Date(
                response.sunrise
              ).toLocaleTimeString()} </p>
              <p class="card-text">Sunset:  ${new Date(
                response.sunset
              ).toLocaleTimeString()} </p>
              <p class="card-text">Created At:  ${new Date(
                response.createdAt
              ).toLocaleString()} </p>
            </div>
          </div>
          </div>
        `;
    weatherInfo.innerHTML = cardHtml;
    displayHistory();
  }

  function displayHistory() {
    $.ajax({
      type: "GET",
      url: "/api/forecast/history",
      success: function (response) {
        var weatherHistory = document.getElementById("weatherHistory");
        var cardHtml = "";
        console.log(response);
        response.forEach(function (entry) {
          var createdAt = new Date(entry.createdAt);
          var formattedCreatedAt = createdAt.toLocaleString();

          cardHtml += `
          <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">weather in  ${entry.city} , ${
            entry.country
          } </h5>
              <p class="card-text">Temperature:  ${entry.temperature} °C</p>
              <p class="card-text">Feels Like:  ${entry.feelsLike} °C</p>
              <p class="card-text">Humidity:  ${entry.humidity} %</p>
              <p class="card-text">Wind Speed:  ${entry.windSpeed}  m/s</p>
              <p class="card-text">Condition:  ${entry.condition} </p>
              <p class="card-text">Description:  ${
                entry.weatherDescription
              } </p>
              <p class="card-text">Sunrise:  ${new Date(
                entry.sunrise
              ).toLocaleString()} </p>
              <p class="card-text">Sunset:  ${new Date(
                entry.sunset
              ).toLocaleString()} </p>
              <p class="card-text">Created At:  ${new Date(
                entry.createdAt
              ).toLocaleString()} </p>
            </div>
          </div>
          </div>
                    `;
        });

        weatherHistory.innerHTML = cardHtml;
      },
      error: function (xhr, status, error) {
        console.error("Error occurred while getting ${weather history");
        console.error(xhr.responseText);
      },
    });
  }

  displayHistory();
});
