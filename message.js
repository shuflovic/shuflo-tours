export function checkpointMessage(messageBody) {
    const whatsappLink = `https://wa.me/+421917809193?text=${encodeURIComponent(messageBody)}`;
    console.log(`WhatsApp Link: ${whatsappLink}`); // Logs the link for debugging
    window.open(whatsappLink, '_blank'); // Open in a new tab
}

