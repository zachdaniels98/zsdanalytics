from flask import Blueprint
from ..db import get_db
import json
from flask import jsonify

bp = Blueprint('baseball_api', __name__, url_prefix='/baseball/api')

@bp.route('/')
def commands():
    return 'List of API Commands'

@bp.route('/player/<int:player_id>', methods=('GET',))
def player(player_id):
    cursor = get_db().cursor(dictionary=True)
    cursor.execute('SELECT * FROM player WHERE player_id = %s', (player_id,))
    stats = cursor.fetchone()
    print(type(stats))
    return stats