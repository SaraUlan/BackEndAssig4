$(document).ready(function () {
  $("#signup-btn").on("click", (event) => {
    const isFormValid = $("#signup-form")[0].checkValidity();
    if (!isFormValid) {
      $("#signup-form")[0].reportValidity();
    } else {
      event.preventDefault();

      const username = $("#username").val();
      const name = $("#name").val();
      const lastname = $("#lastname").val();
      const email = $("#email").val();
      const password = $("#password").val();
      const confirm_password = $("#password-confirm").val();

      if (password !== confirm_password) {
        $("#messages").show();
        $("#messages").html("Passwords are not same!");
        return;
      } else if (password.length <= 8) {
        $("#messages").show();
        $("#messages").html(
          "Password is too small! Make it at least 8 symbols!"
        );
        return;
      }

      const data = {
        username: username,
        name: name,
        lastname: lastname,
        email: email,
        password: password,
      };

      $.ajax({
        type: "POST",
        url: "/api/auth/signup",
        data: data,
        success: function (response) {
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
