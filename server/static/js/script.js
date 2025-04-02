document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('navbar-toggle').addEventListener('click', function () {
        const navbarList = document.getElementById('navbar-list');
        navbarList.classList.toggle('show');
    });

    const chatbotIcon = document.getElementById('chatbot-icon');
    const chatbotContainer = document.getElementById('chatbot');

    if (chatbotIcon && chatbotContainer) {
        chatbotIcon.addEventListener('click', () => {
            console.log('Chatbot icon clicked');
            chatbotContainer.classList.toggle('hidden');

            if (chatbotContainer.classList.contains('hidden')) {
                chatbotContainer.style.display = 'none';
                console.log('Chatbot hidden');
            } else {
                chatbotContainer.style.display = 'block';
                console.log('Chatbot visible');
            }
        });
    } else {
        console.error('Chatbot icon or container not found.');
    }

    const sendButton = document.getElementById('chatbot-send');
    const userInput = document.getElementById('chatbot-input');
    const messagesDiv = document.getElementById('chatbot-messages');

    const appendMessage = (message, className) => {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.className = className;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    };

    sendButton.addEventListener('click', async () => {
        const inputValue = userInput.value.trim();
        if (!inputValue) return;

        appendMessage(inputValue, 'user-message');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: inputValue }),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            const botMessage = data.message || "I'm sorry, I couldn't understand that.";

            appendMessage(botMessage, 'bot-message');
        } catch (error) {
            console.error('Error:', error);
            appendMessage(
                "Sorry, I couldn't connect to the server. Please try again later.",
                'bot-message error-message'
            );
        } finally {
            userInput.value = '';
        }
    });

    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendButton.click();
        }
    });

    const ctx = document.getElementById('sustainabilityChart').getContext('2d');

    const sustainabilityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [
                {
                    label: 'Water Usage (Liters)',
                    data: [500, 450, 400, 380],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2,
                },
                {
                    label: 'Carbon Footprint (kg CO2)',
                    data: [20, 18, 16, 15],
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 2,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
            },
        },
    });
});