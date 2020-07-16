const emailQuery = document.getElementById('emailRes');
const seat = document.getElementById('seat');
const flight = document.getElementById('flight');
const name = document.getElementById('name');
const email = document.getElementById('email');
const resDetails = document.getElementById('user-info2');
const error = document.getElementById('error');
let target = false;
const getReservations = async () => {
    await fetch('/info', {headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json"
    }})
        .then(res => res.json())
        .then(data =>{ 
            data['reservations'].forEach(reservation => {
                if (reservation.email === emailQuery.value) {
                    target = true;
                    error.style.display = 'none';
                    seat.innerText = reservation['seat'];
                    flight.innerText = reservation['flight'];
                    name.innerText = reservation[`givenName`] + ' ' + reservation[`surname`];
                    email.innerText = reservation[`email`];
                    resDetails.style.display = 'block';
                }
            })
            if (!target) {
                resDetails.style.display = 'none';
                error.innerText = `Cannot find reservation for ${emailQuery.value || 'unknown'}`;
                error.style.display = 'block';
            }
            target = false;
            
    })
    }
    