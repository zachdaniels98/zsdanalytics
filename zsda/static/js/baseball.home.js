import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function GameCalendar() {
    const [value, onChange] = useState(new Date());
    return (
        <div>
            <Calendar onChange={onChange} value={value}/>
        </div>
    );
}

class Suggestions extends React.Component {
    constructor(props) {
        super(props);
        this.getMatches = this.getMatches.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        this.props.autoComplete(e);
    }

    getMatches() {
        let matches = [];
        for (let key in this.props.data) {
            matches.push(<button type="button"
                                value={key}
                                className="list-group-item list-group-item-action"
                                key={this.props.data[key]['player_id']}
                                onClick={this.handleClick}>
                                {key}
                        </button>);
        }
        return matches;
    }

    render() {
        return (
            <ul className="list-group">{this.getMatches()}</ul>
        )
    }
}

class PlayerSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: null, value: ''};
        this.handleChange = this.handleChange.bind(this);
        this.autoComplete = this.autoComplete.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchData = this.fetchData.bind(this);
    }

    handleChange(e) {
        this.setState({value: e.target.value});
    }

    autoComplete(e) {
        this.setState({value: e.target.value});
    }

    handleSubmit(e) {
        if (Object.keys(this.state.data).length != 1) {
            alert('Please enter valid name');
            e.preventDefault();
        }
    }

    fetchData() {
        const api_url = 'http://127.0.0.1:5000/baseball/api/players/' + this.state.value;
        fetch(api_url)
            .then(response => response.json())
            .then(data => this.setState({data: data}));
    }

    componentDidUpdate(_prevProps, prevState) {
        if (this.state.value !== prevState.value) {
            if (this.state.value.length >= 2) {
                this.fetchData();
            }
            else {
                this.setState({data: null});
            }
        }
    }

    render() {
        return (
            <form method="POST" onSubmit={this.handleSubmit}>
                <label className="form-label" htmlFor="playerName">Player Search</label>
                <div className="row">
                    <div className="col">
                        <input className="form-control" type="search" name="player-name" id="playerName" value={this.state.value} onChange={this.handleChange} placeholder="Enter Player Name..." />
                        <Suggestions data={this.state.data} autoComplete={this.autoComplete} />
                    </div>
                    <div className="col">
                        <button type="submit" className="btn btn-primary">Search</button>
                    </div>
                </div>
            </form>
        );
    }
}

ReactDOM.render(
    <PlayerSearch />,
    document.getElementById('calendar')
);