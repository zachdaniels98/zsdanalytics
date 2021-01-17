from flask import (
    Blueprint, render_template, redirect, request, url_for
)

bp = Blueprint('baseball', __name__, url_prefix='/baseball')

@bp.route('/', methods=('GET', 'POST'))
def home():
    if request.method == 'POST':
        return redirect(url_for('baseball.player', pid=0))
    return render_template('baseball/home.html')

@bp.route('/player/<int:pid>', methods=('GET',))
def player(pid):
    return render_template('baseball/player.html')