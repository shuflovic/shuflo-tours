export function checkpointMessage(messageBody) {
    const whatsappLink = `https://wa.me/+421917809193?text=${encodeURIComponent(messageBody)}`;
    console.log(titleText);
    window.open(whatsappLink, '_blank'); // Open in a new tab
}

