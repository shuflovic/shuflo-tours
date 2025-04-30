// i_am_in.js
// Use event delegation to handle dynamically created elements
document.addEventListener('DOMContentLoaded', () => {
  // Get trip ID from URL
  const tripId = new URLSearchParams(window.location.search).get('id');
  
  if (!tripId) {
    console.error('No trip ID found in URL');
    return;
  }
  
  // Initialize Supabase client (assuming it's already included in your HTML)
  // const supabase = supabase.createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');
  
  // Load participants list on page load
  loadParticipants();
  
  // Use event delegation to handle clicks on the dynamically created button
  document.addEventListener('click', async (event) => {
    // Check if the clicked element is our button or a child of it
    const button = event.target.closest('#i-am-in');
    if (!button) return; // Not our button, exit handler
    
    // Create a simple modal for name input
    const name = prompt('Please enter your name:');
    
    // Check if user clicked cancel or entered an empty name
    if (!name || name.trim() === '') {
      return;
    }
    
    // Update the database
    try {
      // First, get current participants
      const { data, error: fetchError } = await supabase
        .from('trip')
        .select('i_am_in')
        .eq('id', tripId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Prepare the updated list of participants
      let participants = [];
      if (data && data.i_am_in) {
        participants = Array.isArray(data.i_am_in) ? data.i_am_in : [];
      }
      
      // Add new participant if not already in the list
      if (!participants.includes(name)) {
        participants.push(name);
      }
      
      // Update the database
      const { error: updateError } = await supabase
        .from('trip')
        .update({ i_am_in: participants })
        .eq('id', tripId);
      
      if (updateError) throw updateError;
      
      // Reload the participants list
      loadParticipants();
      
    } catch (error) {
      console.error('Error updating participants:', error);
      alert('Sorry, there was a problem adding you to the trip. Please try again later.');
    }
  });
  
  // Function to load participants from database and display them
  async function loadParticipants() {
    // Try to get the participants list element
    const participantsList = document.getElementById('i-am-in-list');
    if (!participantsList) {
      console.error('Participants list element not found');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('trip')
        .select('i_am_in')
        .eq('id', tripId)
        .single();
      
      if (error) throw error;
      
      // Update the participants list
      if (data && data.i_am_in && Array.isArray(data.i_am_in) && data.i_am_in.length > 0) {
        const participantsHTML = data.i_am_in
          .map(name => `<div class="participant">${escapeHTML(name)}</div>`)
          .join('');
        
        participantsList.innerHTML = participantsHTML;
      } else {
        participantsList.innerHTML = '<p>No participants yet. Be the first to join!</p>';
      }
    } catch (error) {
      console.error('Error loading participants:', error);
      participantsList.innerHTML = '<p>Unable to load participants.</p>';
    }
  }
  
  // Also periodically check if we need to load participants (in case the list is added dynamically)
  const checkInterval = setInterval(() => {
    const participantsList = document.getElementById('i-am-in-list');
    if (participantsList) {
      loadParticipants();
      // Once we've found it, we can reduce the frequency of checks
      clearInterval(checkInterval);
      // Set up a slower refresh interval
      setInterval(loadParticipants, 30000); // Refresh every 30 seconds
    }
  }, 1000); // Check every second initially
  
  // Helper function to prevent XSS
  function escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
