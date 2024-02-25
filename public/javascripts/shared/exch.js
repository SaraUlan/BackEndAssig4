$(document).ready(function () {
  const place = $("#exch");

  $.ajax({
    type: "GET",
    url: "/api/getExchange",
    success: function (response) {
      if (response && response.usdToKZT && response.eurToKZT) {
        place.html(
          `<p>1 USD = ${response.usdToKZT} KZT</p><p>1 EUR = ${response.eurToKZT} KZT</p>`
        );
      } else {
        console.error("Invalid response format");
      }
    },
    error: function (xhr, status, error) {
      console.error(`Error: ${xhr.status} - ${error}`);
    },
  });
});
