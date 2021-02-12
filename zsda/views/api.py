from flask import ( Blueprint, request )
from ..db import get_db
from .analysis import zone_analysis
import json
from flask import jsonify

bp = Blueprint('baseball_api', __name__, url_prefix='/baseball/api')

@bp.route('/')
def commands():
    return 'List of API Commands'

# Get player info
# player_id
# first_name
# last_name
# team_id
# position
@bp.route('/player/<int:player_id>', methods=['GET'])
def player(player_id):
    cursor = get_db().cursor(dictionary=True)
    cursor.execute('SELECT * FROM player WHERE player_id = %s', (player_id,))
    stats = cursor.fetchone()
    cursor.close()
    return stats

# Get player's pitching statistics
@bp.route('/player/<int:player_id>/pitch-stat', methods=['GET'])
def pitch_stat(player_id):
    cursor = get_db().cursor(dictionary=True)
    cursor.execute('SELECT * FROM pitch_stat WHERE player_id = %s', (player_id,))
    stats = cursor.fetchone()
    cursor.close()
    return stats

# Get player's advanced pitching statistics
@bp.route('/player/<int:player_id>/adv-pitch-stat', methods=['GET'])
def adv_pitch_stat(player_id):
    cursor = get_db().cursor(dictionary=True)
    cursor.execute('SELECT * FROM adv_pitch_stat WHERE player_id = %s', (player_id,))
    stats = cursor.fetchone()
    cursor.close()
    return stats

# Get player's batting statistics
@bp.route('/player/<int:player_id>/bat-stat', methods=['GET'])
def bat_stat(player_id):
    cursor = get_db().cursor(dictionary=True)
    cursor.execute('SELECT * FROM bat_stat WHERE player_id = %s', (player_id,))
    stats = cursor.fetchone()
    cursor.close()
    return stats

# Get player's advanced batting statistics
@bp.route('/player/<int:player_id>/adv-bat-stat', methods=['GET'])
def adv_bat_stat(player_id):
    cursor = get_db().cursor(dictionary=True)
    cursor.execute('SELECT * FROM adv_bat_stat WHERE player_id = %s', (player_id,))
    stats = cursor.fetchone()
    cursor.close()
    return stats

# Get zone breakdown for player for either pitching or hitting
# Query
# position, pitch-type, stand
@bp.route('/player/<int:player_id>/zone-breakdown/<int:position>', methods=['GET'])
def zone_breakdown(player_id, position):
    args = request.args
    conditions = ''
    for arg in args:
        col = arg
        val = args.get(arg)
        if val == '':
            continue
        elif col == 'stand':
            conditions += f'\nAND {col} = \'{val}\''
            continue
        elif col == 'outs':
            col = 'outs_when_up'
        elif col in ['1b', '2b', '3b']:
            col = 'on_' + arg
            conditions += f'\nAND {col} != 0'
            continue
        elif col == 'field':
            col = 'topbot'
            if val == 'a':
                val = "'bot'"
            else:
                val = "'top'"
        conditions += f'\nAND {col} = {val}'
    breakdown_type = None
    if position == 0:
        breakdown_type = 'pitcher'
    else:
        breakdown_type = 'batter'
    cursor = get_db().cursor(dictionary=True)
    query = '''
        SELECT game_pk, sv_id, pitch_type, events, description, zone, stand, result, balls, strikes
        FROM pitch
        WHERE {0} = {1}
        {2};
        '''.format(breakdown_type, player_id, conditions)
    print(query)
    cursor.execute(query)
    stats = cursor.fetchall()
    cursor.close()
    return zone_analysis(stats)

# Get team table
# team_id
# location
# mascot
# league
@bp.route('/team/<string:team_id>', methods=['GET'])
def team(team_id):
    cursor = get_db().cursor(dictionary=True)
    cursor.execute('SELECT * FROM team WHERE team_id = %s', (team_id,))
    team_info = cursor.fetchone()
    cursor.close()
    return team_info