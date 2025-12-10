document.addEventListener('DOMContentLoaded', () => {
    const chatHeaderDisplay = document.querySelector('.chat-name-display')
    const chatId = chatHeaderDisplay ? chatHeaderDisplay.id.replace('chat-name-display-', '') : null

    if (!chatId) return

    // Global lytter til at lukke menuer, når der klikkes udenfor
    document.addEventListener('click', (event) => {
        // Lukker chat-header menuen
        const chatHeaderMenu = document.getElementById(`chat-dropdown-menu-${chatId}`)
        const chatHeaderDots = document.querySelector(`#chat-menu-container-${chatId} .dots`)
        // Vælg knappen via dens klasse
        const deleteButton = document.querySelector('.delete-chat-btn')

        if (deleteButton) {
            deleteButton.addEventListener('click', async (event) => {
                // Forhindrer browseren i at navigere væk (href="#")
                event.preventDefault()

                // Henter chat ID fra data-chat-id attributten på knappen
                const chatId = event.target.dataset.chatId

                if (!confirm(`Er du sikker på, at du vil slette chat ID: ${chatId}?`)) {
                    return
                }

                if (chatHeaderMenu && chatHeaderMenu.classList.contains('show') &&
                    !chatHeaderMenu.contains(event.target) &&
                    (!chatHeaderDots || !chatHeaderDots.contains(event.target))) {
                    chatHeaderMenu.classList.remove('show')
                }
            })
        }
    })
})

// Vis/skjul chat header menu
function toggleChatMenu(chatId) {
    const dropdown = document.getElementById(`chat-dropdown-menu-${chatId}`)
    if (dropdown) {
        // Luk alle andre åbne menuer (hvis der er flere)
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            if (menu !== dropdown) {
                menu.classList.remove('show')
            }
        })

        dropdown.classList.toggle('show')
    }
}

//Skift mellem visning af navn og rediger
function toggleEditChatName(chatId) {
    const displayElement = document.getElementById(`chat-name-display-${chatId}`)
    const editForm = document.getElementById(`edit-chat-name-form-${chatId}`)
    const menuContainer = document.getElementById(`chat-menu-container-${chatId}`)
    const inputField = editForm.querySelector('input[name="name"]')

    // Luk menuen først
    const menu = document.getElementById(`chat-dropdown-menu-${chatId}`)
    if (menu) menu.classList.remove('show')

    if (displayElement.style.display !== 'none') {
        // Skift til redigeringstilstand
        displayElement.style.display = 'none'
        editForm.style.display = 'flex'
        if (menuContainer) menuContainer.style.display = 'none'
        inputField.focus()
    } else {
        // Skift til visningstilstand
        displayElement.style.display = ''
        editForm.style.display = 'none'
        if (menuContainer) menuContainer.style.display = ''
        // Nulstil inputfeltet til den aktuelle tekst
        inputField.value = displayElement.textContent.trim()
    }
}

// Funktion til at skifte mellem visning og redigering
function toggleEdit(msgId) {
    const textElement = document.getElementById(`text-${msgId}`)
    const formElement = document.getElementById(`edit-form-${msgId}`)
    const menuElement = document.querySelector(`#msg-${msgId} .menu-container`)

    if (formElement.style.display === 'none') {
        // Vis redigering
        textElement.style.display = 'none'
        formElement.style.display = 'block'
        if (menuElement) menuElement.style.display = 'none'

        // Sæt fokus i feltet
        const inputField = formElement.querySelector('input')
        if (inputField) inputField.focus()
    } else {
        // Annuler redigering
        textElement.style.display = 'inline'
        formElement.style.display = 'none'
        if (menuElement) menuElement.style.display = 'block'
    }
}

//Patch request via fetch API
async function handleChatNameEdit(form, event) {
    event.preventDefault() // Forhindrer normal form submission

    const chatId = form.id.replace('edit-chat-name-form-', '')
    const newName = form.querySelector('input[name="name"]').value.trim()
    const displayElement = document.getElementById(`chat-name-display-${chatId}`)

    if (newName === "" || newName === displayElement.textContent.trim()) {
        toggleEditChatName(chatId) // Luk, hvis ingen ændring
        return false
    }

    try {
        const response = await fetch(`/chats/${chatId}?_method=PATCH`, {
            method: 'POST', // Bruger POST metoden sammen med _method=PATCH
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newName }) // Sørg for at nøglen 'name' matcher din backend
        })

        if (response.ok) {
            // Opdater DOM og skift tilbage til visningstilstand
            displayElement.textContent = newName
            toggleEditChatName(chatId)
        } else if (response.status === 403) {
            alert('Adgang nægtet: Du har ikke tilladelse til at rette chatnavnet.')
            toggleEditChatName(chatId)
        } else {
            alert('Fejl: Kunne ikke opdatere chatnavn.')
            toggleEditChatName(chatId)
        }
    } catch (error) {
        console.error('Netværksfejl ved PATCH:', error)
        alert('Der opstod en netværksfejl under opdateringen.')
        toggleEditChatName(chatId)
    }
    return false
}