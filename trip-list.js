const SUPABASE_URL = 'https://rigsljqkzlnemypqjlbk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpZ3NsanFremxuZW15cHFqbGJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NjI5NTUsImV4cCI6MjA2MTIzODk1NX0.hNdNu9fHGQfdh4WdMFx_SQAVjXvQutBIud3D5CkM9uY';



// Initialize Supabase client
const { createClient } = require('@supabase/supabase-js'); // Ensure you have the Supabase package installed
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Function to fetch trips from Supabase and populate them in the "trip-list"
async function populateTripList() {
    const tripListDiv = document.getElementById("trip-list");

    // Check if the element exists
    if (!tripListDiv) {
        console.error("Element with ID 'trip-list' not found.");
        return;
    }

    try {
        // Fetch trips data from the Supabase table
        const { data: trips, error } = await supabase
            .from('trips')
            .select('title');

        if (error) {
            console.error("Error fetching trips:", error.message);
            return;
        }

        // Clear existing content
        tripListDiv.innerHTML = "";

        // Populate trips into the trip list
        trips.forEach(trip => {
            const tripItemDiv = document.createElement("div");
            tripItemDiv.className = "trip-item";

            // Add trip title
            const tripTitle = document.createElement("p");
            tripTitle.textContent = trip.title;
            tripItemDiv.appendChild(tripTitle);

            // Append trip item to the trip list
            tripListDiv.appendChild(tripItemDiv);
        });

    } catch (err) {
        console.error("Unexpected error:", err.message);
    }
}

// Call the function to populate trips on page load
document.addEventListener("DOMContentLoaded", populateTripList);
