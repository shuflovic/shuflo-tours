// comment.js
document.addEventListener('DOMContentLoaded', () => {
  // Get trip ID from URL
  const tripId = new URLSearchParams(window.location.search).get('id');
  
  if (!tripId) {
    console.error('No trip ID found in URL');
    return;
  }
  
  // Set up a check for the comments section and button
  const checkElementsInterval = setInterval(() => {
    const commentsSection = document.getElementById('comments');
    const addCommentButton = document.getElementById('add-commentButton');
    
    if (commentsSection && addCommentButton) {
      // We found both elements, set up the functionality
      setupCommentFunctionality(commentsSection, addCommentButton, tripId);
      clearInterval(checkElementsInterval);
    }
  }, 500); // Check every half second
});

function setupCommentFunctionality(commentsSection, addCommentButton, tripId) {
  // Load existing comments
  loadComments(commentsSection, tripId);
  
  // Add click event for the add comment button
  addCommentButton.addEventListener('click', () => {
    // Create a simple modal/form for comment input
    createCommentForm(commentsSection, tripId);
  });
}

async function loadComments(commentsSection, tripId) {
  try {
    const { data, error } = await supabaseClient
      .from('trips')
      .select('comments')
      .eq('id', tripId)
      .single();
    
    if (error) throw error;
    
    // Update the comments section
    if (data && data.comments && Array.isArray(data.comments) && data.comments.length > 0) {
      const commentsHTML = data.comments
        .map(comment => `
          <div class="comment"><hr>
      <strong style="color: darkblue;">${escapeHTML(comment.name)}:</strong> ${escapeHTML(comment.text)}
      <br><small>${comment.date || 'Unknown date'}</small>
          </div>
        `)
        .join('');
      
      commentsSection.innerHTML = commentsHTML;
    } else {
      commentsSection.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
    }
  } catch (error) {
    console.error('Error loading comments:', error);
    commentsSection.innerHTML = '<p>Unable to load comments.</p>';
  }
}

function createCommentForm(commentsSection, tripId) {
  // Create a form element
  const form = document.createElement('div');
  form.className = 'comment-form';
  form.innerHTML = `
    <div>
      <label for="comment-name">Name:</label>
      <input type="text" id="comment-name" placeholder="Your name" required>
    </div>
    <div>
      <label for="comment-text">Comment:</label>
      <textarea id="comment-text" placeholder="Add your comment" required></textarea>
    </div>
    <div class="form-buttons">
      <button type="button" style="color: black" id="submit-comment">OK</button>
      <button type="button" style="color: black" id="cancel-comment">Cancel</button>
    </div>
  `;
  
  // Insert the form before the comments list
  commentsSection.insertAdjacentElement('beforebegin', form);
  
  // Add event listeners to the buttons
  document.getElementById('submit-comment').addEventListener('click', () => {
    submitComment(form, commentsSection, tripId);
  });
  
  document.getElementById('cancel-comment').addEventListener('click', () => {
    form.remove();
  });
  
  // Focus on the name input
  document.getElementById('comment-name').focus();
}

async function submitComment(form, commentsSection, tripId) {
  const nameInput = document.getElementById('comment-name');
  const textInput = document.getElementById('comment-text');
  
  // Basic validation
  if (!nameInput.value.trim() || !textInput.value.trim()) {
    alert('Please enter both your name and comment.');
    return;
  }
  
  const name = nameInput.value.trim();
  const text = textInput.value.trim();
  
  try {
    // First, get current comments
    const { data, error: fetchError } = await supabaseClient
      .from('trips')
      .select('comments')
      .eq('id', tripId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Prepare the updated list of comments
    let comments = [];
    if (data && data.comments) {
      comments = Array.isArray(data.comments) ? data.comments : [];
    }
    
    // Add new comment
    comments.unshift({
      name: name,
      text: text,
      date: new Date().toLocaleString()
    });
    
    // Update the database
    const { error: updateError } = await supabaseClient
      .from('trips')
      .update({ comments: comments })
      .eq('id', tripId);
    
    if (updateError) throw updateError;
    
    // Remove the form
    form.remove();
    
    // Reload the comments
    loadComments(commentsSection, tripId);
    
  } catch (error) {
    console.error('Error adding comment:', error);
    alert('Sorry, there was a problem adding your comment. Please try again later.');
  }
}

// Helper function to prevent XSS
function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
