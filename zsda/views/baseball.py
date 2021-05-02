"""Blueprint for /baseball endpoints of zsdanalytics"""

from flask import (
    Blueprint, render_template, redirect, request, url_for
)
from ..db import get_db
from .shared import fields

bp = Blueprint('baseball', __name__, url_prefix='/baseball')

def get_cursor():
    return get_db().cursor(dictionary=True)

def get_player_id(player_name):
    """Returns MLB ID given a player name"""

    first_name, last_name = player_name.rsplit(" ", 1)
    cursor = get_db().cursor(dictionary=True)
    cursor.execute('SELECT player_id FROM player WHERE first_name = %s AND last_name = %s', (first_name, last_name,))
    pid = cursor.fetchone()
    cursor.close()
    return pid

def get_player_pos(player_id):
    """Returns position for a player ID"""

    cursor = get_db().cursor(dictionary=True)
    cursor.execute('SELECT position FROM player WHERE player_id = %s', (player_id,))
    pos = cursor.fetchone()
    cursor.close()
    return pos

def get_player_info(player_id):
    cursor = get_cursor()
    cursor.execute('SELECT * FROM player WHERE player_id = %s', (player_id,))
    info = cursor.fetchone()
    cursor.close()
    return info

def get_stats(stat_type, player_id):
    cursor = get_cursor()
    cursor.execute('SELECT * FROM {} WHERE player_id = {}'.format(stat_type, player_id))
    stats = cursor.fetchone()
    cursor.close()
    stats['avg'] = '{:.3f}'.format(round(stats['avg'], 3))
    return stats

def get_adv_stats(stat_type, player_id):
    cursor = get_cursor()
    cursor.execute('SELECT * FROM adv_{} WHERE player_id = {}'.format(stat_type, player_id))
    adv_stats = cursor.fetchone()
    cursor.close()
    return adv_stats

@bp.route('/', methods=['GET'])
def home():
    """Returns HTML template for baseball homepage. Checks to see if a player is searched for."""

    if request.method == 'GET':
        player_name = request.args.get("player-name")
        if player_name:
            player_id = get_player_id(player_name)['player_id']
            return redirect(url_for('baseball.player', player_id=player_id))
    return render_template('baseball/home.html')

@bp.route('/players/<int:player_id>', methods=['GET'])
def player(player_id):
    """Returns HTML template for player overview page.

    Sends pitching stats to the template and has checks to see if a new player is searched for"""
    
    player_pos = get_player_pos(player_id)
    stat_type = 'pitch_stat' if player_pos['position'] == 'P' else 'bat_stat'
    cursor = get_db().cursor(dictionary=True)
    cursor.execute('SELECT * FROM player WHERE player_id = %s', (player_id,))
    info = cursor.fetchone()
    cursor.execute('SELECT * FROM {} WHERE player_id = {}'.format(stat_type, player_id))
    stats = cursor.fetchone()
    cursor.execute('SELECT * FROM adv_{} WHERE player_id = {}'.format(stat_type, player_id))
    adv_stats = cursor.fetchone()
    cursor.close()
    if request.method == 'GET':
        player_name = request.args.get("player-name")
        if player_name:
            player_id = get_player_id(player_name)['player_id']
            return redirect(url_for('baseball.player', player_id=player_id))
    del stats['player_id']
    return render_template('baseball/player.html', info=info, stats=stats, adv_stats=adv_stats, fields=fields)

@bp.route('/compare', methods=['GET'])
def compare():
    if request.method == 'GET':
        p1 = request.args.get('p1')
        p2 = request.args.get('p2')
        if p1 and p2:
            p1_id = get_player_id(p1)['player_id']
            p2_id = get_player_id(p2)['player_id']
            stat_type = 'pitch_stat' if get_player_pos(p1_id)['position'] == 'P' else 'bat_stat'
            p1_info = get_player_info(p1_id)
            p2_info = get_player_info(p2_id)
            p1_stats = get_stats(stat_type, p1_id)
            p2_stats = get_stats(stat_type, p2_id)
            print(p1_stats['avg'])
            removed = ['player_id', 'tot_bat_faced', 'pitches', 'balls', 'strikes', 'hit_by_pitch', 'wild_pitches', 'balks']
            for stats in [p1_stats, p2_stats]:
                [stats.pop(rem, 0) for rem in removed]
            p1_data = {'info': p1_info, 'stats': p1_stats}
            p2_data = {'info': p2_info, 'stats': p2_stats}
            players = [p1_data, p2_data]
            return render_template('baseball/compare.html', players=players, fields=fields)
    return render_template('baseball/compare.html')