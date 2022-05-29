from flask import Blueprint, render_template, request, flash, redirect, url_for
from .models import User
from werkzeug.security import generate_password_hash, check_password_hash
from . import db
from flask_login import login_user, login_required, logout_user, current_user
import json
from deepface import DeepFace

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = (request.form.get('email')).lower()
        password = request.form.get('password')
        
        user = User.query.filter_by(email=email).first()
        if user:
            if check_password_hash(user.password, password):
                flash('Вход выполнен успешно!', category='success')
                login_user(user, remember=True)
                return redirect(url_for('views.home'))
            else:
                flash('Неправильный пароль, попробуйте ещё раз.', category='error')
        else:
            flash('Email не зарегистрирован.', category='error')

    return render_template("login.html", user=current_user)

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))

@auth.route('/sign-up', methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        email = (request.form.get('email')).lower()
        firstName = request.form.get('firstName')
        password = request.form.get('password')
        confirm = request.form.get('confirm')
        image = request.form.get('url')
        user = User.query.filter_by(email=email).first()
        if image:
            try:
                result_dict = DeepFace.analyze(img_path=image, actions=['gender'])
                if result_dict['gender'] == 'Man':
                    flash('Регистрация только для лиц женского пола!', category='error')
                elif result_dict['gender'] == 'Woman':
                    if user:
                        flash('Email уже зарегистрирован.', category='error')
                    elif len(email) < 4:
                        flash('Email должен быть больше 3 символов', category='error')
                    elif len(firstName) < 2:
                        flash('Имя должно быть больше 1 символа', category='error')
                    elif password != confirm:
                        flash('Пароли не совпадают', category='error')
                    elif len(password) < 7:
                        flash('Пароль должен содержать минимум из 7 символов', category='error')
                    else:
                        new_user = User(email=email, first_name=firstName, password=generate_password_hash(password, method='sha256'))
                        db.session.add(new_user)
                        db.session.commit()
                        login_user(new_user, remember=True)
                        flash('Аккаунт создан!', category='success')
                        return redirect(url_for('views.home'))
            except Exception as _ex:
                flash('Лицо не распознано', category='error')
    return render_template("sign_up.html", user=current_user)

@auth.route('/')
def main():
    return render_template("main.html", user=current_user)