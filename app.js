const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { FID, API_KEY, BASE_URL } = require('./config');

const app = express();
app.use(bodyParser.json());

// Function to post a message to Farcaster
async function postToFarcaster(message) {
    const headers = {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
    };
    const payload = {
        'text': message
    };
    try {
        const response = await axios.post(`${BASE_URL}/v1/messages`, payload, { headers });
        return response.data;
    } catch (error) {
        console.error('Error posting to Farcaster:', error);
        return null;
    }
}

// Route to start the game
app.post('/start_game', async (req, res) => {
    const sentence = "The quick brown ____ jumps over the lazy ____.";
    const farcasterResponse = await postToFarcaster(`Fill in the blanks: ${sentence}`);
    res.json({ status: "Game started", sentence: sentence, farcasterResponse });
});

// Route to submit an answer
app.post('/submit_answer', async (req, res) => {
    const userInput = req.body.answer;
    const correctAnswers = ["fox", "dog"];  // Example correct answers
    const userAnswers = userInput.split(' ');

    let responseMessage = "Try again!";
    if (userAnswers.length === correctAnswers.length && userAnswers.every((answer, index) => answer.toLowerCase() === correctAnswers[index])) {
        responseMessage = "Congratulations! Your answer is correct.";
    }

    const farcasterResponse = await postToFarcaster(responseMessage);
    res.json({ status: "Answer submitted", response: responseMessage, farcasterResponse });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
