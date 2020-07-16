const seat = document.getElementById('seat');
const flight = document.getElementById('flight');
const name = document.getElementById('name');
const email = document.getElementById('email');
const getReservation = async () => {
await fetch('/info', {headers: {
    'Accept': 'application/json',
    "Content-Type": "application/json"
}})
    .then(res => res.json())
    .then(data =>{
        if (seat.innerText !== data[`reservations`][0]['seat']) {
            seat.innerText = data[`reservations`][0]['seat'];
            flight.innerText = data['reservations'][0]['flight'];
            name.innerText = data['reservations'][0][`givenName`] + ' ' + data['reservations'][0][`surname`];
            email.innerText = data['reservations'][0][`email`];
        }
})
}

getReservation()


//console.log(reservations);