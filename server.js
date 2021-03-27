"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { flights } = require("./test-data/flightSeating");
const { reservations } = require("./test-data/reservations");
const { response } = require("express");

const PORT = process.env.PORT || 8000;

const handleFlight = (req, res) => {
    const { flightNumber } = req.params;
    // get all flight numbers
    const allFlights = Object.keys(flights);
    res.json({ allFlights });
    console.log("REAL FLIGHT: ", allFlights.includes(flightNumber));
};

const allFlights = (req, res) => {
    const flightNumbers = Object.keys(flights);
    res.json({ flightNumbers });
};

const getReservations = (req, res) => {
    let { email } = req.params;
    let foundReservations = reservations.forEach((object) => {
        if (object.email === email) {
            console.log(object);
            res.json({
                id: object.id,
                flight: object.flight,
                seat: object.seat,
                givenName: object.givenName,
                surname: object.surname,
                email: object.email,
            });
        } else {
            console.log("not found");
        }
    });
};

const allSeats = (req, res) => {
    res.json({ flights });
};

express()
    .use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept"
        );
        next();
    })
    .use(morgan("dev"))
    .use(express.static("public"))
    .use(bodyParser.json())
    .use(express.urlencoded({ extended: false }))

    // endpoints
    .get("/flights/:flightNumber", handleFlight)
    .get("/flights", allFlights)
    .get("/seats", allSeats)
    .get("/reservations/:email", getReservations)
    .get("/users/:email", (req, res) => {
        const { email } = req.params;
        let foundReservation = reservations[reservations.length - 1];
        console.log(foundReservation.id);
        res.json({
            email: foundReservation.email,
            surname: foundReservation.surname,
            givenName: foundReservation.givenName,
            seat: foundReservation.seat,
            flight: foundReservation.flight,
        });
    })
    .post("/users", (req, res) => {
        let email = req.body.email;
        let flight = req.body.flight;
        let seat = req.body.seat;
        let givenName = req.body.givenName;
        let surname = req.body.surname;
        reservations.push({
            id: Math.floor(Math.random() * 1000000000) + 1,
            flight: flight,
            seat: seat,
            givenName: givenName,
            surname: surname,
            email: email,
        });
        console.log(reservations);
        res.json({ status: "success" });
    })
    .use((req, res) => res.send("Not Found"))
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));
