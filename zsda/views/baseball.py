from flask import (
    Blueprint, render_template, redirect, request, url_for
)
from ..db import get_db
from .shared import fields

bp = Blueprint('baseball', __name__, url_prefix='/baseball')

def get_player_id(player_name):
    first_name, last_name = player_name.rsplit(" ", 1)
    cursor = get_db().cursor(dictionary=True)
    cursor.execute('SELECT player_id FROM player WHERE first_name = %s AND last_name = %s', (first_name, last_name,))
    pid = cursor.fetchone()
    cursor.close()
    return pid

@bp.route('/', methods=['GET'])
def home():
    if request.method == 'GET':
        player_name = request.args.get("player-name")
        if player_name:
            player_id = get_player_id(player_name)['player_id']
            return redirect(url_for('baseball.player', player_id=player_id))
    return render_template('baseball/home.html')

@bp.route('/player/<int:player_id>', methods=['GET'])
def player(player_id):
    cursor = get_db().cursor(dictionary=True)
    cursor.execute('SELECT * FROM player WHERE player_id = %s', (player_id,))
    info = cursor.fetchone()
    cursor.execute('SELECT * FROM pitch_stat WHERE player_id = %s', (player_id,))
    stats = cursor.fetchone()
    cursor.execute('SELECT * FROM adv_pitch_stat WHERE player_id = %s', (player_id,))
    adv_stats = cursor.fetchone()
    cursor.close()
    if request.method == 'GET':
        player_name = request.args.get("player-name")
        if player_name:
            player_id = get_player_id(player_name)['player_id']
            return redirect(url_for('baseball.player', player_id=player_id))
    del stats['player_id']
    return render_template('baseball/player.html', info=info, stats=stats, adv_stats=adv_stats, fields=fields)