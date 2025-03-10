from flask import Flask, request, jsonify, render_template
import requests
import os

app = Flask(
    __name__,
    static_folder='static',
    template_folder='templates'
)

OPENAI_API_KEY = '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'  # Replace with your actual OpenAI API Key

OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/program')
def program():
    return render_template('program.html', google_maps_api_key=os.getenv('GOOGLE_MAPS_API_KEY'))

@app.route('/market')
def market():
    return render_template('marketplace.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        user_message = request.json.get('message')
        if not user_message:
            return jsonify({'message': 'Message is required.'}), 400

        bot_response = get_openai_response(user_message)
        return jsonify({'message': bot_response}), 200
    except Exception as e:
        print(f"Error handling chat message: {e}")
        return jsonify({'message': 'Server error. Please try again later.'}), 500


def get_openai_response(user_message):
    try:
        response = requests.post(
            OPENAI_API_URL,
            json={
                'model': 'gpt-4',
                'messages': [{'role': 'user', 'content': user_message}],
            },
            headers={
                'Authorization': f'Bearer {OPENAI_API_KEY}',
                'Content-Type': 'application/json',
            },
        )

        if response.status_code != 200:
            raise Exception(f"OpenAI request failed with status code {response.status_code}")

        data = response.json()
        bot_message = data['choices'][0]['message']['content']
        return bot_message
    except requests.exceptions.RequestException as e:
        print(f"Request error: {e}")
        return "Sorry, I couldn't process your request."


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
