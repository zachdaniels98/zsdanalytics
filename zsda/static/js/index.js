import React from 'react';
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Nav, Navbar } from 'react-bootstrap';

class Layout extends React.Component {
    render () {
        return (
            <Navbar bg="primary" className="justify-content-around">
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
}

ReactDOM.render(
    <Layout />,
    document.getElementById('root')
)