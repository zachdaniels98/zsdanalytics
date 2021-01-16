from flask import (
    Blueprint, render_template
)

bp = Blueprint('baseball', __name__, url_prefix='/baseball')

@bp.route('/')
def home():
    return render_template('baseball/home.html')