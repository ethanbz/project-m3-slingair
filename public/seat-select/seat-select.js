const flightInput = document.querySelectorAll('.flight');
let seatsDiv = document.getElementById('seats-section');
const confirmButton = document.getElementById('confirm-button');
let flightNumber;
let selection = '';

const renderSeats = (flight) => {
    seatsDiv.remove();
    seatsDiv = document.createElement('div');
    seatsDiv.id = 'seats-section';
    document.getElementById('contain').appendChild(seatsDiv);
    document.querySelector('.form-container').style.display = 'block';
    const alpha = ['A', 'B', 'C', 'D', 'E', 'F'];
    for (let r = 1; r < 11; r++) {
        const row = document.createElement('ol');
        row.classList.add('row');
        row.classList.add('fuselage');
        seatsDiv.appendChild(row);
        for (let s = 1; s < 7; s++) {
            const seatNumber = `${r}${alpha[s-1]}`;
            const seat = document.createElement('li');

            // Two types of seats to render
            const seatOccupied = `<li><label class="seat"><span id="${seatNumber}" class="occupied">${seatNumber}</span></label></li>`
            const seatAvailable = `<li><label class="seat"><input type="radio" name="seat" value="${seatNumber}" /><span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`        
            flight.forEach(spot => {
                if (seatNumber === spot.id) {
                    spot.isAvailable === true ? seat.innerHTML = seatAvailable : seat.innerHTML = seatOccupied;
                }
            })
            row.appendChild(seat);
        }
    }
    
    let seatMap = document.forms['seats'].elements['seat'];
    seatMap.forEach(seat => {
        seat.onclick = () => {
            selection = seat.value;
            seatMap.forEach(x => {
                if (x.value !== seat.value) {
                    document.getElementById(x.value).classList.remove('selected');
                }
            })
            document.getElementById(seat.value).classList.add('selected');
            confirmButton.style.fontSize = '24px';
            confirmButton.style.color = 'white';
            confirmButton.innerHTML = '<div class="lds-dual-ring"></div>Confirm<span id="seat-number"></span>';
            document.getElementById('seat-number').innerText = `(${selection})`;
            confirmButton.disabled = false;
        }
    });
}


const toggleFormContent = (event) => {
    flightInput.forEach(input => {
        if (input.checked) flightNumber = input.value;
    })
    console.log('toggleFormContent: ', flightNumber);
    fetch(`/flights/${flightNumber}`)
        .then(res => res.json())
        .then(data => {
            if (data['available']) {
                console.log(data);
                renderSeats(data['flight']);
            }
        })
    // TODO: contact the server to get the seating availability
    //      - only contact the server if the flight number is this format 'SA###'.
    //      - Do I need to create an error message if the number is not valid?
    
    // TODO: Pass the response data to renderSeats to create the appropriate seat-type.
}

const handleConfirmSeat = (event) => {
    event.preventDefault();
    // TODO: everything in here!
    fetch('/users', {
        method: 'POST',
        body: JSON.stringify({
            'flight': flightNumber,
            'seat': selection,
            'givenName': document.getElementById('givenName').value,
            'surname': document.getElementById('surname').value,
            'email': document.getElementById('email').value,
        }),
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 200) {
            window.location.href = '/confirmed';
        } else {
            confirmButton.innerText = 'EMAIL ALREADY REGISTERED';
            confirmButton.style.color = 'red';
            confirmButton.style.fontSize = '20px';
        }
    })
    

}

flightInput.forEach(flight => flight.addEventListener('change', toggleFormContent))