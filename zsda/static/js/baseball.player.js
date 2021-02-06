import React from 'react';
import ReactDOM from 'react-dom';
import '../scss/custom.scss';

class PlayerInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    // getAPI() {
    //     const api_url = 'http://127.0.0.1:5000/baseball/api/player/477132';
    //     var num = 0;
    //     var kershaw;
    //     fetch(api_url)
    //         .then(response => response.json())
    //         .then(data => this.setState({data: data}));
    // }

    componentDidMount() {
        const api_url = 'http://127.0.0.1:5000/baseball/api/player/477132';
        fetch(api_url)
            .then(response => response.json())
            .then(data => this.setState({data: data}));
    }

    render() {
        return (
            <div className="card text-center">
                <div className="card-body">
                    <h4 className="card-title">{this.state.data.first_name + " " + this.state.data.last_name}</h4>
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
            <button className="zone">{this.props.avg}</button>
        )
    }
}

class ZoneEdge extends React.Component {
    render() {
        return (
            <button className={this.props.zoneNumber}>
                <div className="unskew m-1 position-absolute top-0 start-0">{this.props.avg}</div>
            </button>
        )
    }
}

class Zone extends React.Component {    
    getZoneAvg(idString) {
        if (this.props.data) {
            return this.props.data[idString]['avg'];
        }
        else {
            return '';
        }
    }

    renderZone() {
        let zone = [];
        for (let i = 0; i < 3; i++) {
            let row = []
            for (let j = 0; j < 3; j++) {
                let id = (3 * i) + (1 + j);
                let idString = id.toString();
                row.push(<ZoneSquare key={id} avg={this.getZoneAvg(idString)} />);
            }
            zone.push(<div className="zone-row" key={i}>{row}</div>);
        }
        return zone;
    }

    render() {
        return (
            <div className="full-zone">
                <ZoneEdge zoneNumber="zone-eleven" avg={this.getZoneAvg('11')}/>
                <ZoneEdge zoneNumber="zone-twelve" avg={this.getZoneAvg('12')}/>
                <ZoneEdge zoneNumber="zone-thirteen" avg={this.getZoneAvg('13')}/>
                <ZoneEdge zoneNumber="zone-fourteen" avg={this.getZoneAvg('14')}/>
                <div className="inner-zone">
                    {this.renderZone()}
                </div>
            </div>
        )
    }
}

class Breakdown extends React.Component {
    constructor(props) {
        super(props);

        this.getPitchDistribution = this.getPitchDistribution.bind(this);
    }
    getBreakdownStats(field) {
        if (this.props.data) {
            return this.props.data['total'][field];
        }
        else {
            return '';
        }
    }

    getPitchDistribution() {
        if (this.props.data) {
            const distribution = this.props.data['total']['pitch_type_count']
            let pitchTypes = [];
            let pitchCounts = [];
            for (const pitchType in distribution) {
                pitchTypes.push(<th scope="col" key={pitchType}>{pitchType}</th>);
                pitchCounts.push(<td key={pitchType}>{distribution[pitchType]}</td>)
            }
            return (
                <table className="table">
                    <thead>
                        <tr>{pitchTypes}</tr>
                    </thead>
                    <tbody>
                        <tr>{pitchCounts}</tr>
                    </tbody>
                </table>
            )
        }
        else {
            return '';
        }
    }

    render() {
        return (
            <div className="col d-flex justify content-center">
                <div className="card text-center">
                    <div className="card-body">
                        <h6 className="card-title">Zone Breakdown</h6>
                        <table className="table">
                            <tbody>
                                <tr>
                                    <th scope="row">AVG</th>
                                    <td>{this.getBreakdownStats('avg')}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Pitch Count</th>
                                    <td>{this.getBreakdownStats('pitch_count')}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Pitch Type Distribution</th>
                                    <td>{this.getPitchDistribution()}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Whiff %</th>
                                    <td>{this.getBreakdownStats('whiff')}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

class InteractiveBreakdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        };
    }

    componentDidMount() {
        const api_url = 'http://127.0.0.1:5000/baseball/api/player/477132/zone-breakdown/0';
        fetch(api_url)
            .then(response => response.json())
            .then(data => this.setState({data: data}));
    }

    render() {
        return (
            <div className="row">
                <div className="col">
                    <Zone data={this.state.data}/>
                </div>
                <div className="col m-2">
                    <Breakdown data={this.state.data}/>
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    // <div className="full-zone">
    //     <ZoneEdge zoneNumber="zone-eleven"/>
    //     <ZoneEdge zoneNumber="zone-twelve"/>
    //     <ZoneEdge zoneNumber="zone-thirteen"/>
    //     <ZoneEdge zoneNumber="zone-fourteen"/>
    //     <Zone />
    // </div>,
    <InteractiveBreakdown />,
    document.getElementById('strikezone')
);

// ReactDOM.render(
//     <PlayerInfo />,
//     document.getElementById('player-info')
// )