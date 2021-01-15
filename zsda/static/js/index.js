import React from 'react';
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Nav, Navbar } from 'react-bootstrap';

function Layout(props) {
    return (
        <CustomNav/>
    );
}

function CustomNav(props) {
    return (
        <Navbar bg="primary" classNameName="justify-content-between">
            <Navbar.Brand>
                ZSD Analytics
            </Navbar.Brand>
            <Nav>
                <Nav.Link>About</Nav.Link>
                <Nav.Link>Baseball</Nav.Link>
            </Nav>
        </Navbar>
    );
}

function BSNav(props) {
    return (
        <nav classNameName="navbar navbar-dark bg-primary">
            <div classNameName="container-fluid">
                <a classNameName="navbar-brand" href="#">ZSD Analytics</a>
                <button classNameName="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggler" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                    <span classNameName="navbar-toggler-icon"></span>
                </button>
                <div classNameName="collapse navbar-collapse" id="navbarToggler">
                    <ul classNameName="navbar-nav">
                        <li classNameName="nav-item">
                            <a classNameName="nav-link active" aria-current="page" href="#">Home</a>
                        </li>
                        <li classNameName="nav-item">
                            <a classNameName="nav-link" href="#">Baseball</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

function ExampleNav(props) {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Navbar</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="#">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Features</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Pricing</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

ReactDOM.render(
    <ExampleNav />,
    document.getElementById('root')
)