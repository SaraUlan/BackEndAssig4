$(document).ready(function () {
  $(".btn-like").on("click", function () {
    const articleId = $(this).data("article-id");

    $.ajax({
      type: "POST",
      url: `/api/article/${articleId}/like`,
      success: function (response) {},
      error: function (xhr, status, error) {
        console.error("Error occurred while getting ${weather history");
        console.error(xhr.responseText);
      },
    });

    $(this).prop("disabled", true);
  });
});
