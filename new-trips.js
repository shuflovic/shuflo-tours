// Function to load trips from local storage and display them
function loadTrips() {
    const tripsSection = document.getElementById('trips'); // Get the Upcoming Trips section

    if (!tripsSection) {
        console.error('Element with id "trips" not found.');
        return;
    }

    const trips = JSON.parse(localStorage.getItem('trips')) || []; // Retrieve trips from local storage

    trips.forEach((trip, index) => {
        // Create a new button for each trip
        const tripButton = document.createElement('button');
        tripButton.className = 'blink-button';

        // Create a link element for the trip
        const tripLink = document.createElement('a');
        tripLink.className = 'trip-item';
        tripLink.href = `#`; // Placeholder link, as dynamic trip pages need server-side support
        tripLink.textContent = `${trip.title} - ${trip.dates}`;

        // Append the link to the button
        tripButton.appendChild(tripLink);

        // Append the button directly to the trips section
        tripsSection.appendChild(tripButton);
    });
}

// Call the function to load trips when the page is loaded
document.addEventListener('DOMContentLoaded', loadTrips);
