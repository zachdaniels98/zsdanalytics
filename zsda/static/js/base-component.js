import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css'

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
                <a className="navbar-brand" href="/">ZSD Analytics</a>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/baseball">Baseball</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default MyNav;