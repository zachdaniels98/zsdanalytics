import os

from flask import Flask

def create_app(test_config=None):
    template_dir = 'static/dist/'
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config file if passed in
        app.config.from_mapping(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from . import home
    app.register_blueprint(home.bp)

    from .views import baseball
    app.register_blueprint(baseball.bp)

    return app