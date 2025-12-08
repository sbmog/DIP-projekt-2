// Fil: assets/js/chatPolling.js

(function() {
    // Polling interval i millisekunder
    const POLLING_INTERVAL = 3000 

    // Find chat ID fra URL
    const pathParts = window.location.pathname.split('/')
    const chatId = pathParts[2]

    // Find DOM-elementer
    const messageList = document.querySelector('.messages ul')
    const messagesContainer = document.querySelector('.messages')
    const noMessagesP = document.querySelector('.messages .no-messages')

    if (!messageList || !chatId) return 

    // Funktion til at finde ID'en for den seneste besked i DOM'en
    function getLastMessageIdFromDOM() {
        const existingMessages = messageList.querySelectorAll('li[data-message-id]')
        if (existingMessages.length === 0) {
            return 0 
        }
        
        // Hent ID'en fra den sidst viste besked i listen
        const lastMessage = existingMessages[existingMessages.length - 1]
        const id = parseInt(lastMessage.dataset.messageId)

        return isNaN(id) ? 0 : id
    }

    // Funktion til at hente og vise nye beskeder
    async function fetchNewMessages() {
        const lastId = getLastMessageIdFromDOM()
        
        // Kald det nye API endpoint med den seneste kendte ID
        const url = `/chats/${chatId}/messages/new?lastId=${lastId}`
        const response = await fetch(url)
        
        if (!response.ok) {
            console.error('Fejl ved hentning af beskeder:', response.statusText)
            return
        }

        const data = await response.json()
        const newMessages = data.messages
        
        if (newMessages.length > 0) {
            // Skjul 'Ingen beskeder' tekst
            if (noMessagesP) {
                noMessagesP.style.display = 'none'
            }

            // Tilføj de nye beskeder til DOM'en
            newMessages.forEach(msg => {
                const li = document.createElement('li')
                li.classList.add('message-bubble')
                li.setAttribute('data-message-id', msg.id); // Gem ID'en i DOM'en

                const strong = document.createElement('strong')
                strong.classList.add('user-name')
                strong.textContent = `${msg.userName || 'Bruger'}:`

                const span = document.createElement('span')
                span.classList.add('message-text')
                span.textContent = msg.messageContent

                li.appendChild(strong)
                li.appendChild(span)
                messageList.appendChild(li)
            });
            
            // Scroll ned til bunden
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
    
    // Start Polling og gentag
    setInterval(fetchNewMessages, POLLING_INTERVAL)

    // Initial scroll til bunden, når siden indlæses første gang
    messagesContainer.scrollTop = messagesContainer.scrollHeight
})();