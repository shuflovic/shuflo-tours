    const draftButton = document.getElementById('draft-button');

    if (draftButton) {
        draftButton.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent form submission
            
            // Get the preview section HTML
            const previewSectionHTML = document.querySelector('.preview-section').outerHTML;
            
            // Format the email body
            const subject = encodeURIComponent("New Trip Request: " + (document.getElementById('trip-title').value || "Untitled Trip"));
            const body = encodeURIComponent("Hi Shuflo,\n\nI hope you are doing well,..\n\ni would like to add a trip to your beautiful and very usefull website,.. here are some details:\n\n" + 
                                            getPlainTextPreview() + 
                                            "\n\nthanks a lot\n\nPS: and here is HTML code to make it easier for you to pretend you are real coder:)\n\n" + 
                                            previewSectionHTML);
            
            // Open the default email client with the information
            window.location.href = `mailto:shuflo.tours@gmail.com?subject=${subject}&body=${body}`;
            
            // Provide feedback to user
            alert('mail bude ready skôr ako povieš borievkový koláč');
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

