/**
 * Contains code for reuasble components
 * Currently only used for Player Search bar
 */

import React from 'react';

/**
 * Dropdown that shows suggested searches for players based on input value
 * TODO add in support for arrow up/down keypresses to traverse the list
 */
class Suggestions extends React.Component {
    constructor(props) {
        super(props);
        this.getMatches = this.getMatches.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    /**
     * If a dropdown suggestion is clicked, search using that suggestions value
     * @param {Event} e 
     */
    handleClick(e) {
        this.props.autoComplete(e);
    }

    /**
     * Creates a dropdown of buttons each containing a suggested player name
     * @returns {JSX}
     */
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
        if (matches.length > 0 && !this.props.blurred) {
            return (
            <ul className="list-group dropdown-menu w-100">{matches}</ul>
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

/**
 * Component containing input form with dropdown suggestions
 * Connects to the player list API to get partial matches for suggestions
 */
class PlayerSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: {}, value: '', autocomplete: false, blurred: false};
        this.handleChange = this.handleChange.bind(this);
        this.autoComplete = this.autoComplete.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
    }

    /**
     * Sets new value as characters are typed in
     */
    handleChange(e) {
        this.setState({value: e.target.value});
    }

    /**
     * Sets new value and sets autocomplete to true, which is handled in ComponentDidUpdate
     */
    autoComplete(e) {
        this.setState({value: e.target.value, autocomplete: true});
    }

    /**
     * Check to see if there is a match and if so set autocomplete to true, otherwise alert user
     */
    handleSubmit(e) {
        if (Object.keys(this.state.data).length != 1 && !this.state.autocomplete) {
            alert('Please enter valid name');
            e.preventDefault();
        } else if (Object.keys(this.state.data).length == 1) {
            this.setState({value: Object.keys(this.state.data)[0], autocomplete: true});
        }
    }

    /**
     * Hides the search results when clicking out of the input area
     */
    handleBlur(e) {
        if (e.relatedTarget == null) {
            this.setState({blurred: true});
        } else if (e.relatedTarget.type == "button" && e.relatedTarget.className == "dropdown-item") {
            return;
        }
    }

    /**
     * Makes sure that the search results are appearing when clicking in the input area
     */
    handleFocus(e) {
        this.setState({blurred: false});
    }

    /**
     * Fetch the data from the players API using the inputted value
     */
    fetchData() {
        const api_url = '/baseball/api/players/' + this.state.value;
        fetch(api_url)
            .then(response => response.json())
            .then(data => this.setState({data: data}));
    }

    /**
     * If autocomplete, submit form using input value
     * Otherwise, if 2 or more characters have been inputted fetch data, otherwise set data to empty
     */
    componentDidUpdate(_prevProps, prevState) {
        if (this.state.autocomplete) {
            document.forms["player-search"].submit();
        } else if (this.state.value !== prevState.value) {
            if (this.state.value.length >= 2) {
                this.fetchData();
            } else {
                this.setState({data: {}});
            }
        }
    }

    render() {
        let searchName = "player-name";
        if (this.props.searchName) {
            searchName = this.props.searchName;
        }

        return (
            <form id="player-search" onSubmit={this.handleSubmit} className={this.props.class}>
                <label className="form-label" htmlFor={searchName}>Player Search</label>
                <div className="row">
                    <div className="col-8">
                        <input className="form-control" type="search" name={searchName} id={searchName} value={this.state.value} onChange={this.handleChange} onBlur={this.handleBlur} onFocus={this.handleFocus} placeholder="Enter Player Name" />
                        <Suggestions data={this.state.data} autoComplete={this.autoComplete} blurred={this.state.blurred} />
                    </div>
                    <div className="col">
                        <button type="submit" className="btn btn-primary">Search</button>
                    </div>
                </div>
            </form>
        );
    }
}

export { PlayerSearch };