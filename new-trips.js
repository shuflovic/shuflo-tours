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
        /*tripButton.style.display = 'flex';
        tripButton.style.justifyContent = 'space-between';
        tripButton.style.alignItems = 'center';*/

// Create a link element for the trip
const tripLink = document.createElement('a');
tripLink.className = 'trip-item';
// Dynamically generate the link based on the trip title
tripLink.href = `${trip.title.toLowerCase().replace(/\s+/g, '-')}.html`; // Converts "Sweden Trip" to "sweden-trip.html"
tripLink.textContent = `${trip.title} - ${trip.dates}`;

        // Create a delete button for the trip
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.style.marginLeft = '8px';
        deleteButton.style.backgroundColor = 'salmon';
        deleteButton.style.color = 'white';
        deleteButton.style.border = 'none';
        deleteButton.style.cursor = 'pointer';
        deleteButton.style.fontSize = '0.9em';

        // Add delete functionality
        deleteButton.addEventListener('click', () => {
            deleteTrip(index);
        });

        // Append the link and delete button to the trip button
        tripButton.appendChild(tripLink);
        tripButton.appendChild(deleteButton);

        // Append the button directly to the trips section
        tripsSection.appendChild(tripButton);
    });
}

// Function to delete a trip
function deleteTrip(index) {
    const trips = JSON.parse(localStorage.getItem('trips')) || []; // Retrieve trips from local storage

    // Remove the trip at the specified index
    trips.splice(index, 1);

    // Save the updated trips list back to local storage
    localStorage.setItem('trips', JSON.stringify(trips));

    // Reload the trips display
    reloadTrips();
}

// Function to reload trips (clears and re-renders the trips list)
function reloadTrips() {
    const tripsSection = document.getElementById('trips'); // Get the Upcoming Trips section

    if (!tripsSection) {
        console.error('Element with id "trips" not found.');
        return;
    }

    // Clear existing buttons
    tripsSection.innerHTML = '';

    // Reload the trips
    loadTrips();
}

document.addEventListener('DOMContentLoaded', loadTrips);
