$(document).ready(function () {
  $(".btn-unlike").on("click", function () {
    const articleId = $(this).data("article-id");
    const buttonClicked = this

    $.ajax({
      type: "POST",
      url: `/api/article/${articleId}/unlike`,
      success: function (response) {
        $(buttonClicked).closest(".col-md-3.p-2").remove();
      },
      error: function (xhr, status, error) {
        console.error("Error occurred while getting ${weather history");
        console.error(xhr.responseText);
      },
    });
  });
});
