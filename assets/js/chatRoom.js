document.addEventListener('DOMContentLoaded', () => {
    // Vælg knappen via dens klasse
    const deleteButton = document.querySelector('.delete-chat-btn')

    if (deleteButton) {
        deleteButton.addEventListener('click', async (event) => {
            // Forhindrer browseren i at navigere væk (href="#")
            event.preventDefault()
            
            // Henter chat ID fra data-chat-id attributten på knappen
            const chatId = event.target.dataset.chatId;

            if (!confirm(`Er du sikker på, at du vil slette chat ID: ${chatId}?`)) {
                return
            }

            // Send DELETE request direkte til serveren
            const response = await fetch('/chats/' + chatId, {
                method: 'DELETE'
            });

            if (response.status === 204) {
                // Sletning lykkedes. Navigerer til chat-oversigten.
                window.location.href = '/chats'
            } else {
                alert('Sletning mislykkedes. Tjek dine rettigheder og prøv igen.')
            }
        });
    }
});

// Funktion til at skifte mellem visning og redigering
function toggleEdit(msgId) {
    const textElement = document.getElementById(`text-${msgId}`)
    const formElement = document.getElementById(`edit-form-${msgId}`)
    const menuElement = document.querySelector(`#msg-${msgId} .menu-container`)

    if (formElement.style.display === 'none') {
        // Vis redigering
        textElement.style.display = 'none'
        formElement.style.display = 'block'
        if(menuElement) menuElement.style.display = 'none'
        
        // Sæt fokus i feltet
        const inputField = formElement.querySelector('input')
        if (inputField) inputField.focus()
    } else {
        // Annuler redigering
        textElement.style.display = 'inline'
        formElement.style.display = 'none'
        if(menuElement) menuElement.style.display = 'block'
    }
}