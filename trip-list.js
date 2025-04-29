const SUPABASE_URL = 'https://rigsljqkzlnemypqjlbk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpZ3NsanFremxuZW15cHFqbGJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NjI5NTUsImV4cCI6MjA2MTIzODk1NX0.hNdNu9fHGQfdh4WdMFx_SQAVjXvQutBIud3D5CkM9uY';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        
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
    populateList("rtrip-list", "realized"); // For "rtrip-list" with "realized" filter
});
