function highlightStatus() {
    $(".status-select").addClass("border-primary border-2");
}

function highlightPerson() {
    $(".person-select").addClass("border-primary border-2");
}

function highlightPlace() {
    $(".place-select").addClass("border-primary border-2");
}

function highlightProvince() {
    $("#province").addClass("border-primary border-2");
}

function highlightDistrict() {
    $("#district").addClass("border-primary border-2");
}

function highlightWard() {
    $("#ward").addClass("border-primary border-2");
}

function sortTable(n) {
    let i,
        shouldSwitch,
        switchcount = 0;
    let table = document.getElementById("userTable");
    let switching = true;
    let dir = "asc";

    while (switching) {
        switching = false;
        let rows = table.rows;

        for (i = 1; i < rows.length - 1; i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;

            let x = rows[i].getElementsByTagName("td")[n];
            let y = rows[i + 1].getElementsByTagName("td")[n];
            console.log("\n\n***i = ", i);
            console.log("rows: ", rows);

            console.log("x: ", x);
            console.log("y: ", y);

            if (dir == "asc") {
                console.log("vo ham asc");
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    let text = rows[0].getElementsByTagName("th")[n].innerHTML;
                    console.log("text: ", text);
                    text = text.substring(0, text.length - 1) + "&#9660";
                    rows[0].getElementsByTagName("th")[n].innerHTML = text;
                    console.log("text sau: ", text);
                    console.log("rows[0]: ", rows[0]);
                    console.log("rows[0].getElementsByTagName('th')[n]: ", rows[0].getElementsByTagName("th")[n]);
                    break;
                }
            } else if (dir == "desc") {
                console.log("vo ham desc");
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    let text = rows[0].getElementsByTagName("th")[n].innerHTML;
                    text = text.substring(0, text.length - 1) + "&#9650";
                    console.log("text: ", text);
                    rows[0].getElementsByTagName("th")[n].innerHTML = text;
                    console.log("text sau: ", text);
                    console.log("rows[0]: ", rows[0]);
                    console.log("rows[0].getElementsByTagName('th')[n]: ", rows[0].getElementsByTagName("th")[n]);
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

function sortProductByName() {
    let i,
        shouldSwitch,
        switchcount = 0;
    let table = document.getElementById("userTable");
    let switching = true;
    let dir = "asc";

    while (switching) {
        switching = false;
        let rows = table.rows;

        for (i = 0; i < rows.length - 1; i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;

            let x = rows[i].getElementsByTagName("h4");
            let y = rows[i + 1].getElementsByTagName("h4");

            if (dir == "asc") {
                if (x[0].innerHTML.toLowerCase() > y[0].innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    let text = document.getElementById("arrange_name_btn").innerHTML;
                    text = text.substring(0, text.length - 1) + "&#9660";
                    document.getElementById("arrange_name_btn").innerHTML = text;
                    break;
                }
            } else if (dir == "desc") {
                if (x[0].innerHTML.toLowerCase() < y[0].innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    let text = document.getElementById("arrange_name_btn").innerHTML;
                    text = text.substring(0, text.length - 1) + "&#9650";
                    document.getElementById("arrange_name_btn").innerHTML = text;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

function sortProductByPrice() {
    let i,
        shouldSwitch,
        switchcount = 0;
    let table = document.getElementById("userTable");
    let switching = true;
    let dir = "asc";

    while (switching) {
        switching = false;
        let rows = table.rows;

        for (i = 0; i < rows.length - 1; i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;

            let x = rows[i].getElementsByTagName("p");
            let y = rows[i + 1].getElementsByTagName("p");

            if (dir == "asc") {
                if (
                    parseInt(x[0].innerHTML.toLowerCase().split(" ")[0]) >
                    parseInt(y[0].innerHTML.toLowerCase().split(" ")[0])
                ) {
                    shouldSwitch = true;
                    let text = document.getElementById("arrange_price_btn").innerHTML;
                    text = text.substring(0, text.length - 1) + "&#9660";
                    document.getElementById("arrange_price_btn").innerHTML = text;
                    break;
                }
            } else if (dir == "desc") {
                if (
                    parseInt(x[0].innerHTML.toLowerCase().split(" ")[0]) <
                    parseInt(y[0].innerHTML.toLowerCase().split(" ")[0])
                ) {
                    shouldSwitch = true;
                    let text = document.getElementById("arrange_price_btn").innerHTML;
                    text = text.substring(0, text.length - 1) + "&#9650";
                    document.getElementById("arrange_price_btn").innerHTML = text;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

$().ready(function() {
    $("#searchInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#tableBody tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});