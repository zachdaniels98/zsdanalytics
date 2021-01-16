import React from 'react';
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

function Layout(props) {
    return (
        <div>
            <MyNav />
            <div className="container-fluid mt-3">
                <MyBody />
            </div>
        </div>
    );
}

function MyNav(props) {
    return (
        <nav className="navbar navbar-expand navbar-dark bg-primary">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">ZSD Analytics</a>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="#">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Baseball</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

function MyBody(props) {
    return (
        <div className="row row-cols-1 row-cols-md-2 g-3">
            <div className="col">
                <div className="card">
                    <div className="card-body">
                        <h6 className="card-title text-center">About</h6>
                        <p className="card-text">
                            Hello! Welcome to zsdanalytics.com! This site is my personal project for practicing programming.
                            The site itself is run using a Flask back-end connected to a front-end that utilizes JavaScript React
                            for the interactive UI and designed using Bootstrap. The baseball portion of the site connects to a MySQL database
                            that stores all of the relevant data and uses Python code to run the statistics analysis with the help of popular
                            libraries such as Pandas, NumPy, and more.
                        </p>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className="card">
                    <div className="card-body">
                        <h6 className="card-title text-center">Baseball</h6>
                        <p className="card-text">
                            Looking for more in-depth statistics than regular box scores? The baseball section
                            of this site is aimed at providing pitch-by-pitch analysis of players in a more user-friendly and 
                            straight forward way than other sites. Compare pitchers and batters, find out what pitch types and locations
                            are the most deadly, and go pitch by pitch through games with data easily available on every pitch!
                        </p>
                        <div className="card-body text-center">
                            <a href="#" className="card-link btn btn-primary">Check it out!</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

ReactDOM.render(
    <Layout />,
    document.getElementById('root')
)