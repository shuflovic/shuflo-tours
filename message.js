export function checkpointMessage(airport) {
    const messageBody = "s radostou v srdci ti oznamujem ze sme stastlivo dorazili na letisko v osle";
    const whatsappLink = `https://wa.me/+421917809193?text=${encodeURIComponent(messageBody)}`;
    window.open(whatsappLink, '_blank'); // Open in a new tab
}
