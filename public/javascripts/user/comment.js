$(document).ready(function () {
  $("#btn-comment").on("click", function () {
    const articleId = $(this).data("article-id");
    const comment = $("#comment").val();
      
    $.ajax({
      type: "POST",
      url: `/api/article/${articleId}/comment`,
      data: { comment: comment },
      success: function (response) {
        $("#comments").prepend(`
            <div class="comment rounded bg-light p-3 mt-2">
                <div class="d-flex flex-row gap-3 justify-content-start align-items-center">
                    <img src="https://images.placeholders.dev/?width=200&height=200" width="36" height="36" class="rounded-circle"
                        alt="">
                    <span> ${response.comment.user}></span>
                </div>
                <div class="">${response.comment.comment}</div>
                    <span class="text-secondary">
                    Just Now
                    </span>
            </div>
            `);
      },
      error: function (xhr, status, error) {
        console.error("Error occurred while getting ${weather history");
        console.error(xhr.responseText);
      },
    });

  });
});
