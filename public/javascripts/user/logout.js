$(document).ready(function () {
  $("#logout-btn").on("click", (event) => {
    event.preventDefault();

    $.ajax({
      type: "POST",
      url: "/api/auth/logout",
      success: function (response) {
        if (response.redirect) {
          window.location.href = response.redirect;
        }
      },
      error: function (xhr, status, error) {
        const response = JSON.parse(xhr.responseText);
        console.log(response.message);
      },
    });
  });
});
