from flask import Flask, request, jsonify, render_template, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_bcrypt import Bcrypt
import requests
import os

app = Flask(__name__, static_folder='static', template_folder='templates')

<<<<<<< HEAD

app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'


db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login_page'

OPENAI_API_KEY = 'your_openai_api_key'
OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'


=======
# 🔹 App Configuration
app.config['SECRET_KEY'] = 'your_secret_key'  # Change this!
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'

# 🔹 Database & Authentication Setup
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login_page'  # Change the view name to login_page

# 🔹 OpenAI API Configuration (Optional)
OPENAI_API_KEY = 'your_openai_api_key'  # Replace this!
OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

# ------------------- User Model -------------------
>>>>>>> e985408ac99e37c65367647b2a3c2fb7351dbea9
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

<<<<<<< HEAD

with app.app_context():
    db.create_all()

=======
# 🔹 Initialize DB if not exists
with app.app_context():
    db.create_all()

# ------------------- Routes -------------------
>>>>>>> e985408ac99e37c65367647b2a3c2fb7351dbea9
@app.route('/')
def index():
    return render_template('index.html', user=current_user)

@app.route('/program')
def program():
    return render_template('program.html')

@app.route('/login', methods=['GET'])
<<<<<<< HEAD
def login_page():
    return render_template('login.html')
=======
def login_page():  # Rename to login_page to avoid conflict with Flask-Login's 'login' function
    return render_template('login.html')  # Ensure you have a login.html file
>>>>>>> e985408ac99e37c65367647b2a3c2fb7351dbea9

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

<<<<<<< HEAD

=======
# ------------------- Authentication Routes -------------------
>>>>>>> e985408ac99e37c65367647b2a3c2fb7351dbea9
@app.route('/auth', methods=['POST'])
def auth():
    if request.method == 'POST':
        if 'signup' in request.form:
            username = request.form['username']
            password = request.form['password']

            existing_user = User.query.filter_by(username=username).first()
            if existing_user:
                flash('Username already exists. Try another one.', 'danger')
                return redirect(url_for('index'))

            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
            new_user = User(username=username, password=hashed_password)
            db.session.add(new_user)
            db.session.commit()

            flash('Account created successfully! Please log in.', 'success')
<<<<<<< HEAD
            return redirect(url_for('login_page'))
=======
            return redirect(url_for('login_page'))  # Redirect to login page after signup
>>>>>>> e985408ac99e37c65367647b2a3c2fb7351dbea9

        elif 'login' in request.form:
            username = request.form['username']
            password = request.form['password']

            user = User.query.filter_by(username=username).first()
            if user and bcrypt.check_password_hash(user.password, password):
                login_user(user)
                flash('Login successful!', 'success')
                return redirect(url_for('dashboard'))
            else:
                flash('Invalid username or password', 'danger')

<<<<<<< HEAD
    return redirect(url_for('login_page'))
=======
    return redirect(url_for('login_page'))  # Redirect to login page if something goes wrong
>>>>>>> e985408ac99e37c65367647b2a3c2fb7351dbea9

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out.', 'info')
<<<<<<< HEAD
    return redirect(url_for('login_page'))
=======
    return redirect(url_for('login_page'))  # Redirect to login page after logout
>>>>>>> e985408ac99e37c65367647b2a3c2fb7351dbea9


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
