const flightInput = document.getElementById("flight");
const seatsDiv = document.getElementById("seats-section");
const confirmButton = document.getElementById("confirm-button");

let selection = "";

const flightDropdown = async () => {
    let response = await fetch("http://localhost:8000/flights", {
        method: "GET",
        headers: {
            accept: "application/json",
        },
    });
    let parsed = await response.json();
    parsed.flightNumbers.forEach(function (ele) {
        const option = document.createElement("OPTION");
        flightInput.appendChild(option);
        option.innerText = ele;
    });
};
flightDropdown();

const renderSeats = () => {
    document.querySelector(".form-container").style.display = "block";

    const alpha = ["A", "B", "C", "D", "E", "F"];
    for (let r = 1; r < 11; r++) {
        const row = document.createElement("ol");
        row.classList.add("row");
        row.classList.add("fuselage");
        seatsDiv.appendChild(row);
        for (let s = 1; s < 7; s++) {
            const seatNumber = `${r}${alpha[s - 1]}`;
            const seat = document.createElement("li");
            let openSeats = async () => {
                let response = await fetch("http://localhost:8000/seats", {
                    method: "GET",
                    headers: {
                        accept: "application/json",
                    },
                });
                let parsed = await response.json();
                let flightArray = Object.values(parsed);
                let flightNumber = flightInput.value;
                let seatAvailable = `<li><label class="seat"><input type="radio" name="seat" value="${seatNumber}" /><span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`;
                let seatOccupied = `<li><label class="seat"><span id="${seatNumber}" class="occupied">${seatNumber}</span></label></li>`;
                const currentSeat = parsed.flights[`${flightNumber}`].find(
                    (seat) => seat.id === seatNumber
                );
                if (currentSeat) {
                    if (currentSeat.isAvailable === false) {
                        seat.innerHTML = seatOccupied;
                        row.appendChild(seat);
                    } else {
                        seat.innerHTML = seatAvailable;
                        row.appendChild(seat);
                    }
                }
            };
            openSeats();
        }
    }

    let seatMap = document.forms["seats"].elements["seat"];
    seatMap.forEach((seat) => {
        seat.onclick = () => {
            selection = seat.value;
            seatMap.forEach((x) => {
                if (x.value !== seat.value) {
                    document
                        .getElementById(x.value)
                        .classList.remove("selected");
                }
            });
            document.getElementById(seat.value).classList.add("selected");
            document.getElementById("seat-number").innerText = `(${selection})`;
            confirmButton.disabled = false;
        };
    });
};

const toggleFormContent = (event) => {
    const flightNumber = flightInput.value;
    console.log("toggleFormContent: ", flightNumber);
    fetch(`/flights/${flightNumber}`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
        });
    let openSeats = async () => {
        let response = await fetch("http://localhost:8000/seats", {
            method: "GET",
            headers: {
                accept: "application/json",
            },
        });
        let parsed = await response.json();
        let flightArray = Object.values(parsed);
        console.log(parsed.flights[`${flightNumber}`]);
    };
    openSeats();
    // TODO: contact the server to get the seating availability
    //      - only contact the server if the flight number is this format 'SA###'.
    //      - Do I need to create an error message if the number is not valid?

    // TODO: Pass the response data to renderSeats to create the appropriate seat-type.
    renderSeats();
};

const handleConfirmSeat = (event) => {
    event.preventDefault();
    fetch("/users", {
        method: "POST",
        body: JSON.stringify({
            givenName: document.getElementById("givenName").value,
            surname: document.getElementById("surname").value,
            email: document.getElementById("email").value,
            flight: flightInput.value,
            seat: selection,
        }),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((res) => {
            console.log(selection);
            let email = document.getElementById("email").value;
            let surname = document.getElementById("surname").value;
            let givenName = document.getElementById("givenName").value;
            window.location = `/confirmed.html?email=${email}`;
        });
};

flightInput.addEventListener("blur", toggleFormContent);
