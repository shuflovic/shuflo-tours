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
        tripButton.className = 'blink-button';
        
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

document.addEventListener('DOMContentLoaded', () => {
    // Fetch direct members dynamically from Local Storage
    const directMembers = JSON.parse(localStorage.getItem('members')) || [];

    // Get form elements
    const tripForm = document.getElementById('trip-form');
    const tripTitle = document.getElementById('trip-title');
    const tripStartDate = document.getElementById('trip-start-date');
    const tripEndDate = document.getElementById('trip-end-date');
    const tripLocation = document.getElementById('trip-location');
    const tripParticipants = document.getElementById('trip-participants');
    const tripNotes = document.getElementById('trip-notes');
    const tripItinerary = document.getElementById('trip-itinerary');

    // Get preview elements
    const previewTitle = document.getElementById('preview-title');
    const previewStartDate = document.getElementById('preview-start-date');
    const previewEndDate = document.getElementById('preview-end-date');
    const previewNotes = document.getElementById('preview-notes');
    const previewItinerary = document.getElementById('preview-itinerary');

    // Get participant-related elements
    const selectedParticipantsList = document.getElementById('selected-participants-list');
    const addParticipantButton = document.getElementById('add-participant');
    const invitationCategory = document.getElementById('invitation-category');
    const directMembersList = document.getElementById('direct-members-list');
    const directMembersContainer = document.getElementById('direct-members-container');

    // Populate the direct members list
    if (directMembersList) {
        directMembers.forEach(member => {
            const listItem = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = member.email; // Use email or a unique identifier
            checkbox.id = `member-${member.name.toLowerCase().replace(' ', '-')}`;

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = ` ${member.name}`; // Display the name

            listItem.appendChild(checkbox);
            listItem.appendChild(label);
            directMembersList.appendChild(listItem);
        });
    }

    // Show/hide direct members list based on selection
    if (invitationCategory) {
        invitationCategory.addEventListener('change', () => {
            directMembersContainer.style.display =
                invitationCategory.value === 'direct-members' ? 'block' : 'none';
        });
    }

    // Handle adding participants
    if (addParticipantButton) {
        addParticipantButton.addEventListener('click', () => {
            const selectedCategory = invitationCategory.value;
            const selectedParticipants = [];

            if (selectedCategory === 'all') {
                // Add all direct members
                directMembers.forEach(member => {
                    if (!isParticipantAlreadyAdded(member.name)) {
                        selectedParticipants.push(member.name);
                    }
                });
            } else if (selectedCategory === 'direct-members') {
                // Add manually selected direct members
                const checkboxes = directMembersList.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach(checkbox => {
                    if (checkbox.checked && !isParticipantAlreadyAdded(checkbox.value)) {
                        const member = directMembers.find(m => m.email === checkbox.value);
                        if (member) {
                            selectedParticipants.push(member.name);
                        }
                    }
                });
            }

            // Add selected participants to the list
            selectedParticipants.forEach(participant => {
                const listItem = document.createElement('li');
                listItem.textContent = participant;
                selectedParticipantsList.appendChild(listItem);
            });
        });
    }

    // Helper function to check if a participant is already added
    function isParticipantAlreadyAdded(name) {
        const existingParticipants = selectedParticipantsList.querySelectorAll('li');
        return Array.from(existingParticipants).some(participant => participant.textContent === name);
    }

    // Function to format dates for display
    function formatDate(dateString) {
        if (!dateString) return '--';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Update preview as user types
    if (tripTitle) {
        tripTitle.addEventListener('input', () => {
            previewTitle.textContent = tripTitle.value || '--';
        });
    } else {
        console.error("Element with id 'trip-title' not found.");
    }

    if (tripStartDate) {
        tripStartDate.addEventListener('input', () => {
            previewStartDate.textContent = formatDate(tripStartDate.value);
        });
    }

    if (tripEndDate) {
        tripEndDate.addEventListener('input', () => {
            previewEndDate.textContent = formatDate(tripEndDate.value);
        });
    }

    if (tripNotes) {
        tripNotes.addEventListener('input', () => {
            previewNotes.textContent = tripNotes.value || '--';
        });
    }

if (tripItinerary) {
        tripItinerary.addEventListener('input', () => {
            previewItinerary.textContent = tripItinerary.value || '--';
        });
}
    

    // Handle form submission
    if (tripForm) {
        tripForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent the default form submission

            // Get form data
            const title = tripTitle.value;
            const startDate = tripStartDate.value;
            const endDate = tripEndDate.value;
            const location = tripLocation.value;
            const participants = tripParticipants.value;
            const notes = tripNotes.value;
            const itinerary = tripItinerary.value;

            // Collect selected participants
            const selectedParticipants = [];
            const participantElements = selectedParticipantsList.querySelectorAll('li');
            participantElements.forEach(element => {
                selectedParticipants.push(element.textContent);
            });

            // Create a trip object
            const newTrip = {
                title: title,
                startDate: startDate,
                endDate: endDate,
                location: location,
                maxParticipants: participants,
                notes: notes,
                invitedParticipants: selectedParticipants
            };

            // Retrieve existing trips from local storage
            const existingTrips = JSON.parse(localStorage.getItem('trips')) || [];

            // Add the new trip to the list
            existingTrips.push(newTrip);

            // Save the updated list back to local storage
            localStorage.setItem('trips', JSON.stringify(existingTrips));

            // Provide feedback to the user
            alert('Trip successfully saved!');

            // Optionally reset the form
            tripForm.reset();
            previewTitle.textContent = '--';
            previewStartDate.textContent = '--';
            previewEndDate.textContent = '--';
            previewNotes.textContent = '--';
            previewItinerary.textContent = '--';

            // Clear selected participants list
            selectedParticipantsList.innerHTML = '';
        });
    } else {
        console.error("Element with id 'trip-form' not found.");
    }
});
