import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

function TripCalendar() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabaseClient
        .from('trip')
        .select('id, startDate, title, description, endDate');
      
      if (error) {
        throw error;
      }
      
      // Transform data for FullCalendar
      const formattedTrips = data.map(trip => ({
        id: trip.id,
        title: trip.title || 'Trip',
        start: trip.startDate,
        end: trip.endDate || new Date(new Date(trip.startDate).setDate(new Date(trip.startDate).getDate() + 1)),
        allDay: true,
        extendedProps: {
          description: trip.description || ''
        }
      }));
      
      setTrips(formattedTrips);
    } catch (err) {
      console.error('Error fetching trips:', err);
      setError('Failed to load trips from database');
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (clickInfo) => {
    // You can implement a modal or drawer to show trip details
    alert(`Trip: ${clickInfo.event.title}\nDate: ${clickInfo.event.start.toLocaleDateString()}\n${clickInfo.event.extendedProps.description}`);
  };

  return (
    <div className="trip-calendar-container">
      <h2>My Trip Calendar</h2>
      
      {loading && <div className="loading-indicator">Loading trips...</div>}
      {error && <div className="error-message">{error}</div>}
      
      <div className="calendar-wrapper">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listMonth'
          }}
          events={trips}
          eventClick={handleEventClick}
          eventColor="#4285f4"
          height="auto"
        />
      </div>
    </div>
  );
}

export default TripCalendar;
