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

document.getElementById('updateMap').addEventListener('click', function() {
    const mapCode = document.getElementById('mapInput').value.trim();
    
    if (mapCode !== "") {
        let newMapURL = `https://mapy.com/s/${mapCode}`;
        document.getElementById('preview-mapycom').src = newMapURL;
    } else {
        alert("Please enter a valid map code.");
    }
});
