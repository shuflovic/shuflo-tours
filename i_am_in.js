// i_am_in.js
document.addEventListener('DOMContentLoaded', () => {
  // Get elements and trip ID from URL
  const iAmInButton = document.getElementById('i-am-in');
  const participantsList = document.getElementById('i-am-in-list');
  const tripId = new URLSearchParams(window.location.search).get('id');
  
  if (!tripId) {
    console.error('No trip ID found in URL');
    return;
  }
  
  // Initialize Supabase client (assuming it's already included in your HTML)
  // const supabase = supabase.createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');
  
  // Load participants list on page load
  loadParticipants();
  
  // Add click event listener to the button
  iAmInButton.addEventListener('click', async () => {
    // Create a simple modal for name input
    const name = prompt('Please enter your name:');
    
    // Check if user clicked cancel or entered an empty name
    if (!name || name.trim() === '') {
      return;
    }
    
    // Update the database
    try {
      // First, get current participants
      const { data, error: fetchError } = await supabaseClient
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
    try {
      const { data, error } = await supabaseClient
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
