// Fil: assets/js/chatRoom.js

document.addEventListener('DOMContentLoaded', () => {
    const chatHeaderDisplay = document.querySelector('.chat-name-display');
    const chatId = chatHeaderDisplay ? chatHeaderDisplay.id.replace('chat-name-display-', '') : null;

    if (!chatId) return;

    // Global lytter til at lukke menuer, når der klikkes udenfor
    document.addEventListener('click', (event) => {
        // Lukker chat-header menuen
        const chatHeaderMenu = document.getElementById(`chat-dropdown-menu-${chatId}`);
        const chatHeaderDots = document.querySelector(`#chat-menu-container-${chatId} .dots`);

        if (chatHeaderMenu && chatHeaderMenu.classList.contains('show') &&
            !chatHeaderMenu.contains(event.target) &&
            (!chatHeaderDots || !chatHeaderDots.contains(event.target))) {
            chatHeaderMenu.classList.remove('show');
        }
    })
})

// Skift mellem visning og redigering af beskeder
function toggleEdit(messageId) {
    const textElement = document.getElementById(`text-${messageId}`);
    const editForm = document.getElementById(`edit-form-${messageId}`);
    
    // Luk den globale chat-menu, hvis den er åben
    const chatHeaderDisplay = document.querySelector('.chat-name-display');
    const chatId = chatHeaderDisplay ? chatHeaderDisplay.id.replace('chat-name-display-', '') : null;
    const chatMenu = document.getElementById(`chat-dropdown-menu-${chatId}`);
    if (chatMenu) chatMenu.classList.remove('show');

    // Skift visningstilstand for besked og form
    if (textElement.style.display !== 'none') {
        textElement.style.display = 'none';
        editForm.style.display = 'flex'; // Antager CSS for edit-form bruger flex
        editForm.querySelector('.edit-input').focus();
    } else {
        textElement.style.display = 'block';
        editForm.style.display = 'none';
    }
}


// Vis/skjul chat header menu
function toggleChatMenu(chatId) {
    const dropdown = document.getElementById(`chat-dropdown-menu-${chatId}`);
    if (dropdown) {
        // Luk alle andre åbne menuer (hvis der er flere)
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            if (menu !== dropdown) {
                menu.classList.remove('show');
            }
        });

        dropdown.classList.toggle('show');
    }
}

//Skift mellem visning af navn og rediger
function toggleEditChatName(chatId) {
    const displayElement = document.getElementById(`chat-name-display-${chatId}`);
    const editForm = document.getElementById(`edit-chat-name-form-${chatId}`);
    const menuContainer = document.getElementById(`chat-menu-container-${chatId}`);
    const inputField = editForm.querySelector('input[name="name"]');
    
    // Luk menuen først
    const menu = document.getElementById(`chat-dropdown-menu-${chatId}`);
    if (menu) menu.classList.remove('show');
    
    if (displayElement.style.display !== 'none') {
        // Skift til redigeringstilstand
        displayElement.style.display = 'none';
        editForm.style.display = 'flex'; 
        if (menuContainer) menuContainer.style.display = 'none';
        inputField.focus();
    } else {
        // Skift til visningstilstand
        displayElement.style.display = '';
        editForm.style.display = 'none';
        if (menuContainer) menuContainer.style.display = '';
        // Nulstil inputfeltet til den aktuelle tekst
        inputField.value = displayElement.textContent.trim();
    }
}

//Patch request via fetch API
async function handleChatNameEdit(form, event) {
    event.preventDefault(); // Forhindrer normal form submission
    
    const chatId = form.id.replace('edit-chat-name-form-', '');
    const newName = form.querySelector('input[name="name"]').value.trim();
    const displayElement = document.getElementById(`chat-name-display-${chatId}`);

    if (newName === "" || newName === displayElement.textContent.trim()) {
        toggleEditChatName(chatId); // Luk, hvis ingen ændring
        return false;
    }

    try {
        const response = await fetch(`/chats/${chatId}?_method=PATCH`, {
            method: 'POST', // Bruger POST metoden sammen med _method=PATCH
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newName }) // Sørg for at nøglen 'name' matcher din backend
        });

        if (response.ok) {
            // Opdater DOM og skift tilbage til visningstilstand
            displayElement.textContent = newName;
            toggleEditChatName(chatId);
        } else if (response.status === 403) {
            alert('Adgang nægtet: Du har ikke tilladelse til at rette chatnavnet.');
            toggleEditChatName(chatId);
        } else {
            alert('Fejl: Kunne ikke opdatere chatnavn.');
            toggleEditChatName(chatId); 
        }
    } catch (error) {
        console.error('Netværksfejl ved PATCH:', error);
        alert('Der opstod en netværksfejl under opdateringen.');
        toggleEditChatName(chatId);
    }
    return false;
}