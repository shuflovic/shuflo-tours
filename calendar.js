// Define fetchTrips outside the DOMContentLoaded handler
async function fetchTrips(calendar) {
    try {
        const { data, error } = await supabaseClient
            .from('trips')
            .select('id, startDate, endDate, title, description');
        
        if (error) {
            throw error;
        }
        
        // Convert trips to FullCalendar events format
        const events = data.map(trip => {
            // Determine end date - if not provided, make it same as start date (1-day event)
            let endDate = trip.endDate ? new Date(trip.endDate) : new Date(trip.startDate);
            
            // For all-day events in FullCalendar, the end date is exclusive
            // So we need to add 1 day to the end date
            if (!trip.endDate) {
                endDate.setDate(endDate.getDate() + 1);
            }
            
            return {
                id: trip.id,
                title: trip.title || 'Trip',
                start: trip.startDate,
                end: endDate,
                allDay: true,
                description: trip.description || ''
            };
        });
        
        // Add events to calendar
        calendar.removeAllEvents();
        calendar.addEventSource(events);
        
        // Hide loading message
        document.getElementById('loading').style.display = 'none';
        
    } catch (error) {
        console.error('Error fetching trips:', error);
        document.getElementById('loading').textContent = 'Error loading trips. Please check console.';
    }
}

// Keep the DOMContentLoaded handler light and fast
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the calendar
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next',/*today after next with gap*/
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listMonth'
        },
        events: [], // We'll populate this from Supabase
        eventClassNames: 'trip-event',
        eventClick: function(info) {
            // Redirect to trip detail page with the trip ID
            window.location.href = `trip?id=${info.event.id}`;
        }
    });
    
    // Render the calendar first
    calendar.render();
    
    // Then fetch trips asynchronously after a minimal delay
    // This separates the rendering work from the data fetching work
    setTimeout(() => fetchTrips(calendar), 10);
});
