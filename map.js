document.getElementById('add-map').addEventListener('click', function() {
    document.getElementById('mapModal').style.display = 'block';
});

// Close the modal if the user cancels
document.getElementById('cancelMap').addEventListener('click', function() {
    document.getElementById('mapModal').style.display = 'none';
});

// Update the iframe source when the user confirms
document.getElementById('confirmMap').addEventListener('click', function() {
    const mapCode = document.getElementById('mapInput').value;

    // Ensure the input is not empty
    if (mapCode.trim() !== "") {
        document.getElementById('mapFrame').src = mapCode;
        document.getElementById('mapModal').style.display = 'none';
    } else {
        alert("Please enter a valid map embed code.");
    }
});
