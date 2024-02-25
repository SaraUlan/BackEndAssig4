$(document).ready(function () {
  $(".btn-delete").on("click", function () {
    const itemId = $(this).data("item-id");

    $.ajax({
      type: "POST",
      url: `/admin/api/categories/${itemId}/delete`,
        success: function (response) {
          
            window.location.href = window.location.href;
      },
      error: function (xhr, status, error) {
        console.error("Error occurred while getting ${weather history");
        console.error(xhr.responseText);
      },
    });
  });
});
