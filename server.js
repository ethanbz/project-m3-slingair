'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { flights } = require('./test-data/flightSeating');
const { reservations } = require('./test-data/reservations');
const { v4: uuidv4 } = require('uuid');


const handleFlight = (req, res) => {
    const { flightNumber } = req.params;
    const allFlights = Object.keys(flights);
    // is flightNumber in the array?
    if (allFlights.includes(flightNumber)) {
        res.status(200).json({ available: true, flight: flights[flightNumber] });
    } else {
        res.status(200).json({ available: false});
    }
    console.log('REAL FLIGHT: ', allFlights.includes(flightNumber))
}

const handleReservation = (req, res) => {
    const newReservation = {id: uuidv4(), ...req.body };
    if (reservations.every(reservation => {return reservation.email !== newReservation.email})) {
        reservations.unshift(newReservation);
        flights[`${newReservation.flight}`].forEach(spot => {
            if (spot.id === newReservation.seat) spot.isAvailable = false;
        });
        res.status(200).json({ status: 200 });
    } else {
        res.status(400).json({ status: 400 });
    }
    
}

const getReservations = (req, res) => {
    res.status(200).json({ reservations })
}

express()
    .use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    })
	.use(morgan('dev'))
	.use(express.static('public'))
    .use(bodyParser.json())
    .use(express.urlencoded({extended: false}))
    // endpoints
    .post('/users', handleReservation )
    .get('/info', getReservations)
    .get('/flights/:flightNumber', handleFlight)
    .use((req, res) => res.send('Not Found'))
    .listen(8000, () => console.log(`Listening on port 8000`));