function highlightStatus() {
  $(".status-select").addClass("border-primary border-2");
}
function highlightPerson() {
  $(".person-select").addClass("border-primary border-2");
}
function highlightPlace() {
  $(".place-select").addClass("border-primary border-2");
}

$().ready(function () {
  $("#searchInput").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#tableBody tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
});


