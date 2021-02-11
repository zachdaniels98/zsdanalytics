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
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.onZoneSelect(this.props.zoneId);
    }

    render() {
        let interior;
        if (this.props.isEdge) {
            interior = <div className="unskew m-1 position-absolute top-0 start-0" onClick={this.handleClick}>{this.props.avg}</div>;
        }
        else {
            interior = this.props.avg;
        }

        return (
            <button className={this.props.className} onClick={this.handleClick}>{interior}</button>
        );
    }
}

class Zone extends React.Component {    
    getZoneValue(idString) {
        if (this.props.data) {
            return this.props.data[idString][this.props.zoneValue];
        }
        else {
            return '';
        }
    }

    renderInnerZone() {
        let zone = [];
        for (let i = 0; i < 3; i++) {
            let row = []
            for (let j = 0; j < 3; j++) {
                let id = (3 * i) + (1 + j);
                let idString = id.toString();
                row.push(<ZoneSquare key={id} 
                                    className='zone'
                                    zoneId={idString} 
                                    avg={this.getZoneValue(idString)} 
                                    onZoneSelect={this.props.onZoneSelect}
                                    isEdge={false} />);
            }
            zone.push(<div className="zone-row" key={i}>{row}</div>);
        }
        return zone;
    }

    renderOuterZone() {
        let corners = {
            11: 'zone-eleven',
            12: 'zone-twelve',
            13: 'zone-thirteen',
            14: 'zone-fourteen'
        };
        let edges = [];
        for (var key in corners) {
            let keyString = key.toString();
            edges.push(<ZoneSquare key={key}
                                className={corners[key]}
                                zoneId={keyString}
                                avg={this.getZoneValue(keyString)}
                                onZoneSelect={this.props.onZoneSelect}
                                isEdge={true} />)
        }
        return edges;
    }

    render() {
        return (
            <div className="full-zone">
                {this.renderOuterZone()}
                <div className="inner-zone">
                    {this.renderInnerZone()}
                </div>
            </div>
        )
    }
}

class ZoneValueSelect extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange(e) {
        this.props.onZoneValueChange(e.target.value);
    }

    render() {
        const selectWidth = {width: '170px'}

        return (
            <select className="form-select mt-4" style={selectWidth} aria-label="Zone value select" onChange={this.handleChange}>
                <option value='avg'>Batting Avg</option>
                <option value='pitch_count'>Pitch Count</option>
                <option value='whiff'>Whiff %</option>
            </select>
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
            return this.props.data[this.props.zoneSelect][field];
        }
        else {
            return '';
        }
    }

    getPitchDistribution() {
        if (this.props.data) {
            const distribution = this.props.data[this.props.zoneSelect]['pitch_type_count'];
            let pitchTypes = [];
            let pitchCounts = [];
            for (const pitchType in distribution) {
                pitchTypes.push(<th scope="col" key={pitchType}>{pitchType}</th>);
                pitchCounts.push(<td key={pitchType}>{distribution[pitchType]}</td>);
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
                        <button type="reset" className="btn btn-primary" onClick={this.props.reset}>Reset</button>
                        <h6 className="card-title">Zone Breakdown - {this.props.zoneSelect}</h6>
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

class BreakdownFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {useCount: true};
        this.handleCountChange = this.handleCountChange.bind(this);
    }

    handleCountChange() {
        this.setState(prevState => ({useCount: !prevState.useCount}));
    }

    render() {
        return (
            <form className="row g-1">
                <div className="col-4">
                    <label className="form-label" htmlFor="hands">Batter Handedness</label>
                    <select className="form-select" id="hands">
                        <option value="both">All Batters</option>
                        <option value="left">Left Handed</option>
                        <option value="right">Right Handed</option>
                    </select>
                </div>
                <div className="form-check col-4">
                    <label className="form-check-label" htmlFor="setCount">Set Count?</label>
                    <input className="form-check-input" type="checkbox" id="setCount" onChange={this.handleCountChange}/>
                </div>
                <div className="col-2">
                    <label className="form-label" htmlFor="balls">Balls</label>
                    <select className="form-select" id="balls" disabled={this.state.useCount}>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </div>
                <div className="col-2">
                    <label className="form-label" htmlFor="strikes">Strikes</label>
                    <select className="form-select" id="strikes" disabled={this.state.useCount}>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                    </select>
                </div>
                <div className="col-6">
                    <label className="form-label" htmlFor="inning">Inning</label>
                    <select className="form-select" id="inning">
                        <option value="all">All Innings</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                    </select>
                </div>
                <div className="col-6">
                    <label className="form-label" htmlFor="homeAway">Home or Away</label>
                    <select className="form-select" id="homeAway">
                        <option value="all">All Games</option>
                        <option value="home">Home Games</option>
                        <option value="away">Away Games</option>
                    </select>
                </div>
                <div className="form-check col-4">
                    <label className="form-check-label" htmlFor="firstBase">1B</label>
                    <input className="form-check-input" type="checkbox" id="firstBase" />
                </div>
                <div className="form-check col-4">
                    <label className="form-check-label" htmlFor="secondBase">2B</label>
                    <input className="form-check-input" type="checkbox" id="secondBase" />
                </div>
                <div className="form-check col-4">
                    <label className="form-check-label" htmlFor="thirdBase">3B</label>
                    <input className="form-check-input" type="checkbox" id="thirdBase" />
                </div>
                <div className="col-12">
                    <button className="btn btn-primary" type="submit">Submit Filters</button>
                </div>
            </form>
        )
    }
}

class InteractiveBreakdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            zoneSelect: 'total',
            zoneValue: 'avg'
        };

        this.selectZone = this.selectZone.bind(this);
        this.resetBreakdown = this.resetBreakdown.bind(this);
        this.setZoneValue = this.setZoneValue.bind(this);
    }

    selectZone(zoneId) {
        this.setState({zoneSelect: zoneId});
    }

    componentDidMount() {
        const api_url = 'http://127.0.0.1:5000/baseball/api/player/477132/zone-breakdown/0';
        fetch(api_url)
            .then(response => response.json())
            .then(data => this.setState({data: data}));
    }

    resetBreakdown() {
        this.setState({zoneSelect: 'total'});
    }

    setZoneValue(value) {
        this.setState({zoneValue: value});
    }

    render() {
        const cardStyle = {
            width: '24rem'
        };

        return (
            <div className="row border d-flex justify-content-center">
                <div className="col">
                    <ZoneValueSelect onZoneValueChange={this.setZoneValue} />
                    <Zone data={this.state.data} onZoneSelect={this.selectZone} zoneValue={this.state.zoneValue} />
                </div>
                <div className="col" style={cardStyle}>
                    <Breakdown data={this.state.data} zoneSelect={this.state.zoneSelect} reset={this.resetBreakdown} />
                </div>
                <div className="col">
                    <BreakdownFilter />
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <InteractiveBreakdown />,
    document.getElementById('strikezone')
);

// ReactDOM.render(
//     <PlayerInfo />,
//     document.getElementById('player-info')
// )