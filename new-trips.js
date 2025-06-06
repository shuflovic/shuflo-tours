// Update the loadTrips function to append trips to #trip-list
function loadTrips() {
    const tripList = document.getElementById('trip-list'); // Get the trips list container

    if (!tripList) {
        console.error('Element with id "trip-list" not found.');
        return;
    }

    const trips = JSON.parse(localStorage.getItem('trips')) || []; // Retrieve trips from local storage

    trips.forEach((trip, index) => {
        // Create a new button for each trip
        const tripButton = document.createElement('button');
        tripButton.className = 'vote-button';
        
        // Create a link element for the trip
        const tripLink = document.createElement('a');
        tripLink.className = 'trip-item';
        tripLink.href = `${trip.title.toLowerCase().replace(/\s+/g, '-')}.html`; // Dynamically generate the trip link
        tripLink.textContent = `${trip.title} - ${trip.startDate}`;
        
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

        // Append the button directly to the trips list
        tripList.appendChild(tripButton);
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
    const tripList = document.getElementById('trip-list'); // Get the container for trips list
    
    if (!tripList) {
        console.error('Element with id "trip-list" not found.');
        return;
    }
    
    // Clear only the trips list, leaving the header (h2) intact
    tripList.innerHTML = '';
    
    // Reload the trips
    loadTrips();
}

document.addEventListener('DOMContentLoaded', loadTrips);
