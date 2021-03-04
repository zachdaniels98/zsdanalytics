"""Init file to create the Flask web app.

Registers blueprints for app and sets up db file that contains the connection to the MySQL database"""

import os

from flask import Flask

def create_app(test_config=None):
    # template_dir = 'static/dist/'
    application = Flask(__name__, instance_relative_config=True)
    # app.config.from_mapping(
    #     SECRET_KEY='dev',
    # )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        application.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config file if passed in
        application.config.from_mapping(test_config)

    try:
        os.makedirs(application.instance_path)
    except OSError:
        pass

    from . import home
    application.register_blueprint(home.bp)

    from .views import baseball, api, analysis, shared
    application.register_blueprint(baseball.bp)
    application.register_blueprint(api.bp)

    from . import db

    return application