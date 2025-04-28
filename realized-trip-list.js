const SUPABASE_URL = 'https://rigsljqkzlnemypqjlbk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpZ3NsanFremxuZW15cHFqbGJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NjI5NTUsImV4cCI6MjA2MTIzODk1NX0.hNdNu9fHGQfdh4WdMFx_SQAVjXvQutBIud3D5CkM9uY';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        
// Function to fetch trips from Supabase and populate them in the "trip-list"
async function populateTripList() {
    const rTripListDiv = document.getElementById("realized-trip-list");
    if (!rTripListDiv) {
        console.error("Element with ID 'realized-trip-list' not found.");
        return;
    }

    try {
        console.log("Fetching trips...");
        const { data: realized_trips, error } = await supabaseClient
            .from('realized_trips')
            .select('id, title');

        if (error) {
            console.error("Error fetching realized trips:", error.message);
            return;
        }

        console.log("Realized rips fetched:", realized_trips);

        rTripListDiv.innerHTML = ""; // Clear existing content

        if (!realized_trips || realized_trips.length === 0) {
            rTripListDiv.innerHTML = "<p>No realized trips found</p>";
            return;
        }

        realized_trips.forEach(realized_trip => {
            const rTripButton = document.createElement("button");
            const rTripLink = document.createElement("a");
            rTripButton.className = "trip-button";
            rTipLink.href = `trip.html?id=${trip.id}`;
            rTripLink.textContent = trip.title;
            rTripButton.appendChild(tripLink);
            tTripListDiv.appendChild(tripButton);
        });
    } catch (err) {
        console.error("Unexpected error:", err.message);
    }
}
// Make sure to call the function when the page loads
document.addEventListener('DOMContentLoaded', populateRTripList);
