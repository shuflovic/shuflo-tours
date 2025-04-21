// Find your draft button and add a click event handler
const draftButton = document.getElementById('draft-button');

if (draftButton) {
    draftButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent form submission
        
        // Get the preview section HTML
        const previewSection = document.querySelector('.preview-section').innerHTML;
        
        // Format the email body
        const subject = encodeURIComponent("New Trip Request: " + (document.getElementById('trip-title').value || "Untitled Trip"));
        const body = encodeURIComponent("Hi Shuflo,\n\nPlease add a new trip with the following details:\n\n" + 
                                        getPlainTextPreview());
        
        // Open the default email client with the information
        window.location.href = `mailto:shuflo.tours@gmail.com?subject=${subject}&body=${body}`;
        
        // Provide feedback to user
        alert('but trpezlivy, mail bude hotovy skor ako povies borievkovy kolac');
    });
}

// Function to get preview content as plain text
function getPlainTextPreview() {
    const title = document.getElementById('preview-title').textContent;
    const startDate = document.getElementById('preview-start-date').textContent;
    const endDate = document.getElementById('preview-end-date').textContent;
    const itinerary = document.getElementById('preview-itinerary').textContent;
    const notes = document.getElementById('preview-notes').textContent;
    
    // Format the text content
    let textContent = "Trip Title: " + title + "\n";
    textContent += "Start Date: " + startDate + "\n";
    textContent += "End Date: " + endDate + "\n";
    textContent += "Itinerary: " + itinerary + "\n";
    textContent += "Notes: " + notes + "\n";
    
    // Add participants information if any
    const participantsList = document.getElementById('selected-participants-list');
    if (participantsList && participantsList.children.length > 0) {
        textContent += "\nInvited Participants:\n";
        
        const participants = participantsList.querySelectorAll('li');
        participants.forEach(participant => {
            textContent += "- " + participant.textContent + "\n";
        });
    }
    
    return textContent;
}
