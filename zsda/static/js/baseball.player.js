import React from 'react';
import ReactDOM from 'react-dom';
import '../scss/custom.scss';

class PlayerInfo extends React.Component {
    render() {
        return (
            <div className="card text-center">
                <div className="card-body">
                    <h4 className="card-title">Player Name</h4>
                    <div className="btn-group" role="group" aria-label="pitch type checkbox toggle button group">
                        <input type="checkbox" className="btn-check" id="btncheck1" autoComplete="off"></input>
                        <label className="btn btn-outline-primary" htmlFor="btncheck1">4-Seam Fastball</label>
                        <input type="checkbox" className="btn-check" id="btncheck2" autoComplete="off"></input>
                        <label className="btn btn-outline-primary" htmlFor="btncheck2">Slider</label>
                        <input type="checkbox" className="btn-check" id="btncheck3" autoComplete="off"></input>
                        <label className="btn btn-outline-primary" htmlFor="btncheck3">Curve</label>
                        <input type="checkbox" className="btn-check" id="btncheck4" autoComplete="off"></input>
                        <label className="btn btn-outline-primary" htmlFor="btncheck4">Changeup</label>
                    </div>
                    <div className="row">
                        <div className="col">
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <th scope="row">W-L</th>
                                        <td>8-4</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">ERA</th>
                                        <td>2.45</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">G</th>
                                        <td>21</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">GS</th>
                                        <td>21</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="col">
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <th scope="row">IP</th>
                                        <td>86.2</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">H</th>
                                        <td>124</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">R</th>
                                        <td>32</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">ER</th>
                                        <td>27</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

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
                row.push(<ZoneSquare key={(3 * i) + (1 + j)}/>);
            }
            zone.push(<div className="zone-row" key={i}>{row}</div>);
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

ReactDOM.render(
    <PlayerInfo />,
    document.getElementById('player-info')
)