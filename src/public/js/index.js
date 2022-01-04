function highlightStatus() {
  $(".status-select").addClass("border-primary border-2");
}
function highlightPerson() {
  $(".person-select").addClass("border-primary border-2");
}
function highlightPlace() {
  $(".place-select").addClass("border-primary border-2");
}
function sortTable(n) {
  let i,
    shouldSwitch,
    switchcount = 0;
  let table = document.getElementById("userTable");
  let switching = true;
  //Set the sorting direction to ascending:
  let dir = "asc";
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    let rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < rows.length - 1; i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      let x = rows[i].getElementsByTagName("td")[n];
      let y = rows[i + 1].getElementsByTagName("td")[n];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          let text = rows[0].getElementsByTagName("th")[n].innerHTML;
          text = text.substring(0, text.length - 1) + "&#9660";
          rows[0].getElementsByTagName("th")[n].innerHTML = text;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          let text = rows[0].getElementsByTagName("th")[n].innerHTML;
          text = text.substring(0, text.length - 1) + "&#9650";
          rows[0].getElementsByTagName("th")[n].innerHTML = text;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

$().ready(function () {
  $("#searchInput").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#tableBody tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
});
