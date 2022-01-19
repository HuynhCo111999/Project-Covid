
var dtToday = new Date();

function handleChangeDate() {
    const date = $("#dateInput").val();
    $.ajax({
        url: "https://localhost:3000/moderator/api/getamountbytime",
        type: 'post',
        data: { date },
        success: function (data) {
            const newCount = Object.values(data.rs);
            newCount.forEach((element, index) => {
                chart1.data.datasets[0].data[index] = element;
            });
            chart1.update();
        },
        error: function (e) {
            console.log(e.message);
        }
    });
}