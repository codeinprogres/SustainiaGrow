from flask import Flask, request, jsonify, render_template, redirect, url_for, flash, get_flashed_messages
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_bcrypt import Bcrypt
import requests
import os

app = Flask(__name__, static_folder='static', template_folder='templates')

# 🔹 App Configuration
app.config['SECRET_KEY'] = 'your_secret_key'  # Change this!
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'

# 🔹 Database & Authentication Setup
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login_page'  # Change the view name to login_page

# 🔹 OpenAI API Configuration (Optional)
OPENAI_API_KEY = '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'  # Replace with your actual OpenAI API Key

OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'


# ------------------- User Model -------------------
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# 🔹 Initialize DB if not exists
with app.app_context():
    db.create_all()

# ------------------- Routes -------------------
@app.route('/')
def index():
    return render_template('index.html', user=current_user)

@app.route('/program')
def program():
    return render_template('program.html')

@app.route('/login', methods=['GET'])
def login_page():
    messages = get_flashed_messages(with_categories=True)

    # Filter out duplicate "Please log in to access this page."
    unique_messages = []
    seen_messages = set()

    for category, message in messages:
        if message not in seen_messages:
            seen_messages.add(message)
            unique_messages.append((category, message))

    return render_template('login.html', messages=unique_messages)


@app.route('/market')
def market():
    return render_template('marketplace.html')

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', user=current_user)

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/pricing')
def pricing():
    return render_template('pricing.html')

# ------------------- Chat API -------------------

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

from flask import session  # Import session to clear flashed messages

@app.route('/auth', methods=['POST'])
def auth():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        if 'signup' in request.form:  # Signup logic
            existing_user = User.query.filter_by(username=username).first()
            if existing_user:
                flash('Username already exists. Try another one.', 'danger')
                return redirect(url_for('login_page'))  # Redirect to login page

            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
            new_user = User(username=username, password=hashed_password)
            db.session.add(new_user)
            db.session.commit()

            flash('Successfully signed up! Please log in.', 'success')
            return redirect(url_for('login_page'))  # Redirect to login page

        elif 'login' in request.form:  # Login logic
            user = User.query.filter_by(username=username).first()
            if user and bcrypt.check_password_hash(user.password, password):
                login_user(user)
                flash('Login successful!', 'success')
                return redirect(url_for('dashboard'))
            else:
                flash('Invalid username or password', 'danger')
                return redirect(url_for('login_page'))  # Stay on login page if failed

    return redirect(url_for('login_page'))  # Redirect if something goes wrong


@app.route('/logout')
@login_required
def logout():
    logout_user()
    session.clear()  # Clears all flashed messages
    flash('You have been logged out.', 'info')
    return redirect(url_for('login_page'))  # Redirect to login page after logout

@app.route('/my_account')
@login_required
def my_account():
    # Retrieve the current user details
    user = current_user
    # Sample pricing-related data (can be adjusted according to your pricing model)
    pricing_details = {
        "Basic Plan": "$0/month",
        "Premium Plan": "$29/month",
        "Enterprise Plan": "$79/month"
    }

    # Pass the user details and pricing info to the template
    return render_template('my_account.html', user=user, pricing=pricing_details)
# ------------------- Run the Flask App -------------------
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
