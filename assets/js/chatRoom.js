// Fil: assets/js/chatRoom.js

document.addEventListener('DOMContentLoaded', () => {
    // Vælg knappen via dens klasse
    const deleteButton = document.querySelector('.delete-chat-btn');

    if (deleteButton) {
        deleteButton.addEventListener('click', async (event) => {
            // Forhindrer browseren i at navigere væk (href="#")
            event.preventDefault(); 
            
            // Henter chat ID fra data-chat-id attributten på knappen
            const chatId = event.target.dataset.chatId;

            if (!confirm(`Er du sikker på, at du vil slette chat ID: ${chatId}?`)) {
                return;
            }

            // Send DELETE request direkte til serveren
            const response = await fetch('/chats/' + chatId, {
                method: 'DELETE'
            });

            if (response.status === 204) {
                // Sletning lykkedes. Navigerer til chat-oversigten.
                window.location.href = '/chats'; 
            } else {
                alert('Sletning mislykkedes. Tjek dine rettigheder og prøv igen.');
            }
        });
    }
});