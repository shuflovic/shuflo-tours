
        
// Function to fetch trips from Supabase and populate them in the "trip-list"
async function populateRTripList() {
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
            rTipLink.href = `rtrip.html?id=${trip.id}`;
            rTripLink.textContent = trip.title;
            rTripButton.appendChild(rTripLink);
            tTripListDiv.appendChild(rTripButton);
        });
    } catch (err) {
        console.error("Unexpected error:", err.message);
    }
}
// Make sure to call the function when the page loads
document.addEventListener('DOMContentLoaded', populateRTripList);
