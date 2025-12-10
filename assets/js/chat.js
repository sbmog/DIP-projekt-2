/* Slette function af en chat */
async function deleteChat(chatId) {
    if (!confirm('Er du sikker på, at du vil slette denne chat?')) return
    const response = await fetch('/chats/' + chatId, {
        method: 'DELETE'
    });
    if (response.ok) {
        window.location.reload();
    } else {
        alert('Der skete en fejl. Kunne ikke slette chatten.')
    }
}