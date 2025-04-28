const SUPABASE_URL = 'https://rigsljqkzlnemypqjlbk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpZ3NsanFremxuZW15cHFqbGJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NjI5NTUsImV4cCI6MjA2MTIzODk1NX0.hNdNu9fHGQfdh4WdMFx_SQAVjXvQutBIud3D5CkM9uY';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        
// Function to fetch trips from Supabase and populate them in the "trip-list"
async function populateTripList() {
    const tripListDiv = document.getElementById("trip-list");
    if (!tripListDiv) {
        console.error("Element with ID 'trip-list' not found.");
        return;
    }

    try {
        console.log("Fetching trips...");
        const { data: trips, error } = await supabaseClient
            .from('trips')
            .select('id, title');
            .eq('status', 'upcoming');

        if (error) {
            console.error("Error fetching trips:", error.message);
            return;
        }

        console.log("Trips fetched:", trips);

        tripListDiv.innerHTML = ""; // Clear existing content

        if (!trips || trips.length === 0) {
            tripListDiv.innerHTML = "<p>No trips found</p>";
            return;
        }

        trips.forEach(trip => {
            const tripButton = document.createElement("button");
            const tripLink = document.createElement("a");
            tripButton.className = "trip-button";
            tripLink.href = `trip.html?id=${trip.id}`;
            tripLink.textContent = trip.title;
            tripButton.appendChild(tripLink);
            tripListDiv.appendChild(tripButton);
        });
    } catch (err) {
        console.error("Unexpected error:", err.message);
    }
}
// Make sure to call the function when the page loads
document.addEventListener('DOMContentLoaded', populateTripList);
