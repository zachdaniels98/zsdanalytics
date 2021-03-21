"""API for zsdanalytics

Returns player data and team data in dictionary form that is transformed into JSON format when rendered"""

from flask import ( Blueprint, request )
from ..db import get_db
from .analysis import zone_analysis
import json
from flask import jsonify

bp = Blueprint('baseball_api', __name__, url_prefix='/baseball/api')

@bp.route('/')
def commands():
    return 'List of API Commands' # TODO add list of API calls

@bp.route('/players/<string:name>', methods=['GET'])
def players(name):
    # Start working on adding batter support
    """Return list of player names (max 10) and their MLB IDs that have partial matches in first or last names"""

    name += '%'
    if ' ' in name: # Check if search contains first and last names. IF yes set full to true
        fname, lname = name.rsplit(" ", 1) # BUG need fix for 3 name players (Hyun Jin Ryu)
        full = 'AND'
    else:
        fname = name
        lname = name
        full = 'OR'
    query = '''
            SELECT player_id, first_name, last_name 
            FROM player 
            WHERE (first_name LIKE '{}' {} last_name LIKE '{}')
            # AND position = 'P'
            LIMIT 10;
            '''.format(fname, full, lname)
    cursor = get_db().cursor(dictionary=True)
    cursor.execute(query)
    stats = cursor.fetchall()
    cursor.close()
    cleaned = {}
    for p in stats:
        cleaned[p['first_name'] + ' ' + p['last_name']] = {'player_id': p['player_id']}
    return cleaned

@bp.route('/player/<int:player_id>', methods=['GET'])
def player(player_id):
    """Returns player info for given player ID

    Contains Player ID, player first name, player last name, team abbreviation and player position"""

    cursor = get_db().cursor(dictionary=True)
    cursor.execute('SELECT * FROM player WHERE player_id = %s;', (player_id,))
    stats = cursor.fetchone()
    cursor.close()
    return stats

@bp.route('/player/<int:player_id>/pitch-stat', methods=['GET'])
def pitch_stat(player_id):
    """Return player's pitching statistics"""

    cursor = get_db().cursor(dictionary=True)
    cursor.execute('SELECT * FROM pitch_stat WHERE player_id = %s;', (player_id,))
    stats = cursor.fetchone()
    cursor.close()
    return stats

@bp.route('/player/<int:player_id>/adv-pitch-stat', methods=['GET'])
def adv_pitch_stat(player_id):
    """Return player's advanced pitching statistics"""

    cursor = get_db().cursor(dictionary=True)
    cursor.execute('SELECT * FROM adv_pitch_stat WHERE player_id = %s;', (player_id,))
    stats = cursor.fetchone()
    cursor.close()
    return stats

@bp.route('/player/<int:player_id>/bat-stat', methods=['GET'])
def bat_stat(player_id):
    """Return player's batting statistics"""

    cursor = get_db().cursor(dictionary=True)
    cursor.execute('SELECT * FROM bat_stat WHERE player_id = %s;', (player_id,))
    stats = cursor.fetchone()
    cursor.close()
    return stats

@bp.route('/player/<int:player_id>/adv-bat-stat', methods=['GET'])
def adv_bat_stat(player_id):
    """Return player's advanced batting statistics"""

    cursor = get_db().cursor(dictionary=True)
    cursor.execute('SELECT * FROM adv_bat_stat WHERE player_id = %s;', (player_id,))
    stats = cursor.fetchone()
    cursor.close()
    return stats

@bp.route('/player/<int:player_id>/zone-breakdown/<int:position>', methods=['GET'])
def zone_breakdown(player_id, position):
    """Return zone breakdown data for player

    position 0 == pitcher, 1 == position player
    Reads URL search query parameters, executes query to MySQL database using parameters as filters
    Calls zone_analysis in analysis.py to calculate values from returned data"""

    args = request.args
    conditions = ''
    for arg in args:
        col = arg
        val = args.get(arg)
        if val == '':
            continue
        elif col == 'stand' or col == 'p_throws':
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
    cursor.execute(query)
    stats = cursor.fetchall()
    cursor.close()
    return zone_analysis(stats, position)

@bp.route('/team/<string:team_id>', methods=['GET'])
def team(team_id):
    """Returns team data

    Contains abbreviated team name (LAD), location (Los Angeles), mascot (Dodgers), league (NL)"""

    cursor = get_db().cursor(dictionary=True)
    cursor.execute('SELECT * FROM team WHERE team_id = %s', (team_id,))
    team_info = cursor.fetchone()
    cursor.close()
    return team_info