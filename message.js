export function checkpointMessage(airport) {

    const messageBody = "stastlivo sme dorazili";
   
    const whatsappLink = `https://wa.me/+421917809193?text=${encodeURIComponent(messageBody)}`;
    window.open(whatsappLink, '_blank'); // Open in a new tab
}
