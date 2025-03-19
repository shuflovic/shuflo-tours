export function checkpointMessage(airport) {
    const shoppingList = shoppingListText.value;
    const emailBody = "stastlivo sme dorazili";
   
    const whatsappLink = `https://wa.me/+421917809193?text=${encodeURIComponent(emailBody)}`;
    window.open(whatsappLink, '_blank'); // Open in a new tab
}
