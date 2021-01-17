import React from 'react';
import ReactDOM from 'react-dom';
import '../css/custom.css';

class ZoneSquare extends React.Component {
    render() {
        return (
            <button className="zone"></button>
        )
    }
}

class ZoneEdge extends React.Component {
    render() {
        return (
            <button className="zone-edge"></button>
        )
    }
}

class Zone extends React.Component {
    renderZoneRow() {
        zones = Array(3).fill(null);
        row = zones.map((zone) => <ZoneSquare />);
        return row;
    }

    renderInnerZone() {
        rows = Array(3).fill(null);
        zone = rows.map((row) => 
            <div className="zone-row">
                {this.renderZoneRow()}
            </div>
        );
        return zone;
    }

    renderSomething() {
        let zone = [];
        for (let i = 0; i < 3; i++) {
            let row = []
            for (let j = 0; j < 3; j++) {
                row.push(<ZoneSquare />);
            }
            console.log(row);
            zone.push(<div className="zone-row">{row}</div>);
        }
        return zone;
    }

    render() {
        return (
            <div>
                {this.renderSomething()}
            </div>
        )
    }
}

ReactDOM.render(
    <Zone />,
    document.getElementById('strikezone')
);