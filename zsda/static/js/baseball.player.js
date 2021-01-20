import React from 'react';
import ReactDOM from 'react-dom';
import '../scss/custom.scss';

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
            <button className={this.props.zoneNumber}></button>
        )
    }
}

class Zone extends React.Component {
    renderZone() {
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
            <div className="inner-zone">
                {this.renderZone()}
            </div>
        )
    }
}

ReactDOM.render(
    <div className="full-zone">
        <ZoneEdge zoneNumber="zone-eleven"/>
        <ZoneEdge zoneNumber="zone-twelve"/>
        <ZoneEdge zoneNumber="zone-thirteen"/>
        <ZoneEdge zoneNumber="zone-fourteen"/>
        <Zone />
    </div>,
    document.getElementById('strikezone')
);