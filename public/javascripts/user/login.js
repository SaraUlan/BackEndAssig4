$(document).ready(function () {
  $("#login-btn").on("click", (event) => {
    const isFormValid = $("#login-form")[0].checkValidity();

    if (!isFormValid) {
      $("#login-form")[0].reportValidity();
    } else {
      event.preventDefault();

      const username = $("#username").val();
      const password = $("#password").val();

      const data = {
        username: username,
        password: password,
      };

      $.ajax({
        type: "POST",
        url: "/api/auth/login",
        data: data,
        success: function (response) {
          console.log("Success: ", response);
          if (response.redirect) {
            window.location.href = response.redirect;
          }
        },
        error: function (xhr, status, error) {
          const response = JSON.parse(xhr.responseText);
          const messages = $("#messages");
          messages.show();
          messages.html(response.message);
        },
      });
    }
  });
});
