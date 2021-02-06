from flask import (
    Blueprint, render_template, redirect, request, url_for
)
from ..db import get_db
from .shared import fields

bp = Blueprint('baseball', __name__, url_prefix='/baseball')

@bp.route('/', methods=('GET', 'POST'))
def home():
    if request.method == 'POST':
        return redirect(url_for('baseball.player', player_id=0))
    return render_template('baseball/home.html')

@bp.route('/player/<int:player_id>', methods=('GET',))
def player(player_id):
    # TEST
    player_id = 477132
    cursor = get_db().cursor(dictionary=True)
    cursor.execute('SELECT * FROM player WHERE player_id = %s', (player_id,))
    info = cursor.fetchone()
    cursor.execute('SELECT * FROM pitch_stat WHERE player_id = %s', (player_id,))
    stats = cursor.fetchone()
    cursor.execute('SELECT * FROM adv_pitch_stat WHERE player_id = %s', (player_id,))
    adv_stats = cursor.fetchone()
    cursor.close()
    return render_template('baseball/player.html', info=info, stats=stats, adv_stats=adv_stats, fields=fields)