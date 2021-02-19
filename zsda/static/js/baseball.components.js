import React from 'react';

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
                                className="dropdown-item"
                                key={this.props.data[key]['player_id']}
                                onClick={this.handleClick}>
                                {key}
                        </button>);
        }
        if (matches.length > 0) {
            return (
            <ul className="list-group dropdown-menu">{matches}</ul>
            );
        } else {
            return '';
        }
    }

    render() {
        return (
            <div className="dropdown">{this.getMatches()}</div>
        );
    }
}

class PlayerSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: {}, value: '', autocomplete: false};
        this.handleChange = this.handleChange.bind(this);
        this.autoComplete = this.autoComplete.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchData = this.fetchData.bind(this);
    }

    handleChange(e) {
        this.setState({value: e.target.value});
    }

    autoComplete(e) {
        this.setState({value: e.target.value, autocomplete: true});
    }

    handleSubmit(e) {
        if (Object.keys(this.state.data).length != 1 && !this.state.autocomplete) {
            alert('Please enter valid name');
            e.preventDefault();
        } else if (Object.keys(this.state.data).length == 1) {
            this.setState({value: Object.keys(this.state.data)[0], autocomplete: true});
        }
    }

    fetchData() {
        const api_url = 'http://127.0.0.1:5000/baseball/api/players/' + this.state.value;
        fetch(api_url)
            .then(response => response.json())
            .then(data => this.setState({data: data}));
    }

    componentDidUpdate(_prevProps, prevState) {
        if (this.state.autocomplete) {
            let playerForm = document.getElementById("player-search");
            playerForm.requestSubmit();
        } else if (this.state.value !== prevState.value) {
            if (this.state.value.length >= 2) {
                this.fetchData();
            } else {
                this.setState({data: {}});
            }
        }
    }

    render() {
        return (
            <form id="player-search" onSubmit={this.handleSubmit}>
                <label className="form-label" htmlFor="playerName">Player Search</label>
                <div className="row">
                    <div className="col-8">
                        <input className="form-control" type="search" name="player-name" id="playerName" value={this.state.value} onChange={this.handleChange} placeholder="Enter Player Name" />
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

export default PlayerSearch;