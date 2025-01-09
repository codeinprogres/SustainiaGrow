const axios = require('axios');

const FLASK_API_URL = 'http://localhost:5000/api/chat';

/**
 * Function to handle chat messages by sending them to the Flask API.
 * @param {string} userMessage - The user's input message.
 * @returns {Promise<string>} - The bot's response.
 * @throws {Error} - Throws an error if the API call fails.
 */
async function handleChatMessage(userMessage) {
    if (!userMessage) {
        throw new Error('User message is required.');
    }

    try {
        const response = await axios.post(
            FLASK_API_URL,
            { message: userMessage },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.status === 200 && response.data.message) {
            return response.data.message;
        } else {
            throw new Error('Unexpected response format from the server.');
        }
    } catch (error) {
        console.error('Error in Flask API call:', error.message || error);
        throw new Error('Failed to fetch response from the server.');
    }
}

module.exports = { handleChatMessage };
