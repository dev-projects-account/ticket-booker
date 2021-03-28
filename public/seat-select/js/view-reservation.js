//view reservations page
const viewReservations = function () {
    let passedEmail = location.search.split("=");
    let email = passedEmail[1];
    fetch("/reservations/" + email, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((res) => {
            let id = res.id;
            let flight = res.flight;
            let seat = res.seat;
            let givenName = res.givenName;
            let surname = res.surname;
            let email = res.email;
            let name = document.getElementById("name");
            let resSeat = document.getElementById("seat");
            let resFlight = document.getElementById("flight");
            let resEmail = document.getElementById("email");
            name.innerText = `${givenName}` + " " + `${surname}`;
            resSeat.innerText = seat;
            resFlight.innerText = flight;
            resEmail.innerText = email;
        });
};
viewReservations();
