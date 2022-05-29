from flask import Blueprint, render_template, request, flash, redirect
from flask_login import login_required, current_user
from .models import Note, User
from . import db
import json

views = Blueprint('views', __name__)


@views.route('/home', methods=['GET', 'POST'])
@login_required
def home():
    data = db.session.query(Note).order_by(-Note.id)
    users = db.session.query(User).order_by(-User.id)

    if request.method == 'POST':
        note = request.form.get('note')

        if len(note) < 1:
            flash('Пост слишком короткий!', category='error')
        else:
            new_note = Note(data=note, user_id=current_user.id)
            db.session.add(new_note)
            db.session.commit()
            flash('Пост добавлен!', category='success')
            return redirect("/home")

    return render_template("home.html", user=current_user, data=data, users=users)

@views.route('/delete-note', methods=['POST'])
def delete_note():
    note = json.loads(request.data)
    noteId = note['noteId']
    note = Note.query.get(noteId)
    if note:
        if note.user_id == current_user.id:
            db.session.delete(note)
            db.session.commit()

    return jsonify({})



