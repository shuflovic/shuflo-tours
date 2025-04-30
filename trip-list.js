        
// Function to fetch trips from Supabase and populate them in the "trip-list"
async function populateList(listId, statusFilter) {
    const listDiv = document.getElementById(listId);
    if (!listDiv) {
        console.error(`Element with ID '${listId}' not found.`);
        return;
    }

    try {
        console.log(`Fetching trips with status '${statusFilter}'...`);
        const { data: trips, error } = await supabaseClient
            .from('trips')
            .select('id, title')
            .eq('status', statusFilter);

        if (error) {
            console.error(`Error fetching trips for '${listId}':`, error.message);
            return;
        }

        console.log(`Trips fetched for '${listId}':`, trips);

        listDiv.innerHTML = ""; // Clear existing content

        if (!trips || trips.length === 0) {
            listDiv.innerHTML = `<p>No trips found for status '${statusFilter}'</p>`;
            return;
        }

        trips.forEach(trip => {
            const tripButton = document.createElement("button");
            const tripLink = document.createElement("a");
            tripButton.className = "trip-button";
            tripLink.href = `trip.html?id=${trip.id}`;
            tripLink.textContent = trip.title;
            tripButton.appendChild(tripLink);
            listDiv.appendChild(tripButton);
        });
    } catch (err) {
        console.error(`Unexpected error for '${listId}':`, err.message);
    }
}

// Make sure to call the function twice with appropriate parameters when the page loads
document.addEventListener('DOMContentLoaded', () => {
    populateList("trip-list", "upcoming");  // For "trip-list" with "upcoming" filter
    populateList("rtrip-list", "realized");
    populateList("ctrip-list", "cancelled");// For "rtrip-list" with "realized" filter
});
