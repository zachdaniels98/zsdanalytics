import React from 'react';
import ReactDOM from 'react-dom';
import PlayerSearch from './baseball.components';
import '../scss/custom.scss';

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

        const colorStyle = this.props.background(this.props.value);

        if (this.props.isEdge) {
            interior = <div className="unskew m-1 position-absolute top-0 start-0" onClick={this.handleClick}>{this.props.value}</div>;
        } else {
            interior = this.props.value;
        }

        return (
            <button className={this.props.className} onClick={this.handleClick} style={colorStyle}>{interior}</button>
        );
    }
}

class Zone extends React.Component {
    constructor(props) {
        super(props);
        this.getBackgroundColor = this.getBackgroundColor.bind(this);
    }

    getZoneValue(idString) {
        if (this.props.data) {
            let val = this.props.data[idString][this.props.zoneValue];
            if (this.props.zoneValue != 'pitch_count') {
                val = val.toFixed(3);
            }
            return val;
        } else {
            return '';
        }
    }

    getBackgroundColor(val) {
        let dataCopy = Object.assign({}, this.props.data);
        delete dataCopy['Total'];
        let values = []
        for (const idk in dataCopy) {
            values.push(dataCopy[idk][this.props.zoneValue]);
        }
        values.sort((a, b) => a - b);
        const min = values[0];
        const max = values[values.length - 1];
        const range = max - min;
        let color = ((val - min) * 1.4) / (range) - 0.7;
        if (val >= (min + max) / 2) {
            return { backgroundColor: `rgba(255, 0, 0, ${color})`};
        } else {
            return { backgroundColor: `rgba(0, 0, 255, ${-color})`};
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
                                    value={this.getZoneValue(idString)} 
                                    onZoneSelect={this.props.onZoneSelect}
                                    isEdge={false} background={this.getBackgroundColor} />);
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
                                value={this.getZoneValue(keyString)}
                                onZoneSelect={this.props.onZoneSelect}
                                isEdge={true} background={this.getBackgroundColor} />)
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
        const selectWidth = {width: '8rem'};

        return (
            <select className="form-control form-select mt-4" style={selectWidth} aria-label="Zone value select" onChange={this.handleChange}>
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
            let val = this.props.data[this.props.zoneSelect][field];
            if (field == 'avg' || field == 'whiff') {
                val = val.toFixed(3);
            }
            return val;
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
            <div className="col mt-5 d-flex flex-column align-items-center justify-content-center">
                <div className="card text-center">
                    <div className="card-body">
                        <h6 className="col card-title">Zone Breakdown* - {this.props.zoneSelect}</h6>
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
                                <tr className="align-middle">
                                    <th scope="row">Pitch Type Distribution</th>
                                    <td>{this.getPitchDistribution()}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Whiff %</th>
                                    <td>{this.getBreakdownStats('whiff')}</td>
                                </tr>
                            </tbody>
                        </table>
                        <button type="reset" className="btn btn-primary" onClick={this.props.reset}>Reset</button>
                    </div>
                </div>
            </div>
        )
    }
}

class BreakdownFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {count: false};
        this.handleCount = this.handleCount.bind(this);
    }

    handleCount() {
        this.setState(prevState => ({count: !prevState.count}));
    }

    componentDidMount() {
        let paramCount = new URLSearchParams(window.location.search).get('balls');
        if (paramCount) {
            this.setState({count: true});
        }
    }

    render() {
        const params = new URLSearchParams(window.location.search);

        return (
            <form className="d-flex flex-column mx-auto">
                <div className="row mb-2">
                    <div className="col-5">
                        <label className="form-label" htmlFor="stand">Batter Handedness</label>
                        <select className="form-select" id="stand" name="stand" defaultValue={params.get('stand')}>
                            <option value="">All Batters</option>
                            <option value="l">Left Handed</option>
                            <option value="r">Right Handed</option>
                        </select>
                    </div>
                    <div className="col d-flex align-items-center">
                        <div className="form-check">
                            <label className="form-check-label" htmlFor="setCount">Set Count?</label>
                            <input className="form-check-input" type="checkbox" id="setCount"
                                onChange={this.handleCount}
                                defaultChecked={params.get('balls')} />
                        </div>
                    </div>
                    <div className="col">
                        <label className="form-label" htmlFor="balls">Balls</label>
                        <select className="form-select" id="balls" name="balls" defaultValue={params.get('balls')} disabled={!this.state.count}>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </div>
                    <div className="col">
                        <label className="form-label" htmlFor="strikes">Strikes</label>
                        <select className="form-select" id="strikes" name="strikes" defaultValue={params.get('strikes')} disabled={!this.state.count}>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                        </select>
                    </div>
                </div>
                <div className="row mb-2">
                    <div className="col">
                        <label className="form-label" htmlFor="inning">Inning</label>
                        <select className="form-select" id="inning" name="inning" defaultValue={params.get('inning')}>
                            <option value="">Select Inning</option>
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
                    <div className="col">
                        <label className="form-label" htmlFor="outs">Outs</label>
                        <select className="form-select" id="outs" name="outs" defaultValue={params.get('outs')}>
                            <option value="">Select # of Outs</option>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                        </select>
                    </div>
                </div>
                <div className="row mb-2">
                    <div className="col-4">
                        <label className="form-label" htmlFor="homeAway">Home or Away</label>
                        <select className="form-select" id="homeAway" name="field" defaultValue={params.get('field')}>
                            <option value="">All Games</option>
                            <option value="h">Home Games</option>
                            <option value="a">Away Games</option>
                        </select>
                    </div>
                    <div className="col">
                        <label className="form-label" htmlFor="onBase">Runners on Base</label>
                        <div id="onBase">
                            <div className="form-check form-check-inline">
                                <label className="form-check-label" htmlFor="firstBase">1B</label>
                                <input className="form-check-input" type="checkbox" id="firstBase" name="1b" defaultChecked={params.get('1b')} />
                            </div>
                            <div className="form-check form-check-inline">
                                <label className="form-check-label" htmlFor="secondBase">2B</label>
                                <input className="form-check-input" type="checkbox" id="secondBase" name="2b" defaultChecked={params.get('2b')} />
                            </div>
                            <div className="form-check form-check-inline">
                                <label className="form-check-label" htmlFor="thirdBase">3B</label>
                                <input className="form-check-input" type="checkbox" id="thirdBase" name="3b" defaultChecked={params.get('3b')} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mx-auto">
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
            zoneSelect: 'Total',
            zoneValue: 'avg',
            error: false
        };

        this.selectZone = this.selectZone.bind(this);
        this.resetBreakdown = this.resetBreakdown.bind(this);
        this.setZoneValue = this.setZoneValue.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
    }

    selectZone(zoneId) {
        this.setState({zoneSelect: zoneId});
    }

    componentDidMount() {
        const path = window.location.pathname;
        const player_id = path.substring(17);
        const params = new URLSearchParams(window.location.search);
        const api_url = `http://127.0.0.1:5000/baseball/api/player/${player_id}/zone-breakdown/0?${params.toString()}`;
        fetch(api_url)
            .then(response => response.json())
            .then(data => this.setState({data: data}))
            .catch(error => {
                this.setState({error: true});
                console.error('Error:', error);
            });
    }

    resetBreakdown() {
        this.setState({zoneSelect: 'Total'});
    }

    setZoneValue(value) {
        this.setState({zoneValue: value});
    }

    handleRefresh() {
        window.location = window.location.pathname;
    }

    render() {
        const cardStyle = {
            width: '24rem'
        };

        const zoneWidth = {
            minWidth: '276px'
        };

        if (this.state.data) {
            return (
                <div className="row border mt-2">
                    <div className="col d-flex justify-content-center" style={cardStyle}>
                        <Breakdown data={this.state.data} zoneSelect={this.state.zoneSelect} reset={this.resetBreakdown} />
                    </div>
                    <div className="col-3 d-flex flex-column align-items-center" style={zoneWidth}>
                        <ZoneValueSelect onZoneValueChange={this.setZoneValue} />
                        <Zone data={this.state.data} onZoneSelect={this.selectZone} zoneValue={this.state.zoneValue} />
                        <div className="mb-2">
                            <p className="text-muted text-center">To see specific stats*, click on a zone</p>
                        </div>
                    </div>
                    <div className="col d-flex flex-column justify-content-center">
                        <BreakdownFilter />
                    </div>
                </div>
            )
        } else if (this.state.error) {
            return (
                    <div className="text-center fs-1">
                        <p>No Data</p>
                        <button className="btn btn-primary" onClick={this.handleRefresh}>Reload?</button>
                    </div>
            )
        } else {
            return (
                <div className="row mt-2">
                    <div className="text-center fs-1">Loading...</div>
                </div>
            )
        }
    }
}

ReactDOM.render(
    <InteractiveBreakdown />,
    document.getElementById('breakdown')
);

ReactDOM.render(
    <PlayerSearch class="mb-3"/>,
    document.getElementById('newsearch')
);