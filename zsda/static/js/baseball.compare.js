import React from 'react';
import ReactDOM from 'react-dom';
import { SearchBar } from './baseball.components';

class CompareSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pOneData: {},
            pTwoData: {},
            pOneValue: '',
            pTwoValue: ''
        }
        this.playerOneChange = this.playerOneChange.bind(this);
        this.playerTwoChange = this.playerTwoChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.checkPositions = this.checkPositions.bind(this);
    }

    playerOneChange(e) {
        this.setState({pOneValue: e.target.value});
    }

    playerTwoChange(e) {
        this.setState({pTwoValue: e.target.value});
    }

    checkPositions() {
        if (Object.keys(this.state.pOneData).length == 1 && Object.keys(this.state.pTwoData).length == 1) {
            let playerOnePos = Object.values(this.state.pOneData)[0]['position'];
            let playerTwoPos = Object.values(this.state.pTwoData)[0]['position'];
            if (playerOnePos == 'P' && playerTwoPos == 'P') {
                return true;
            } else if (playerOnePos == 'P' || playerTwoPos == 'P') {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    handleSubmit(e) {
        if (Object.keys(this.state.pOneData).length != 1 || Object.keys(this.state.pTwoData).length != 1) {
            alert('Please enter two valid players');
            e.preventDefault();
        } else if (!this.checkPositions()) {
            alert('Players must be same of the same type (Both pitchers or both position players)');
            e.preventDefault();
        }
    }

    fetchData(player) {
        let playerName = player == 1 ? this.state.pOneValue : this.state.pTwoValue;
        const api_url = '/baseball/api/players/' + playerName;
        fetch(api_url)
            .then(response => response.json())
            .then(data => {
                if (player == 1) {
                    this.setState({pOneData: data})
                } else {
                    this.setState({pTwoData: data})
                }
            });
    }

    componentDidUpdate(_prevProps, prevState) {
        if (this.state.pOneValue !== prevState.pOneValue) {
            if (this.state.pOneValue.length >= 2) {
                this.fetchData(1);
            } else {
                this.setState({pOneData: {}});
            }
        } else if (this.state.pTwoValue !== prevState.pTwoValue) {
            if (this.state.pTwoValue.length >= 2) {
                this.fetchData(2);
            } else {
                this.setState({pTwoData: {}});
            }
        }
    }

    render() {
        return (
            <form id="player-search" onSubmit={this.handleSubmit} className={this.props.class}>
                <label className="form-label" htmlFor="playerOne">Player One</label>
                <label className="form-label" htmlFor="playerTwo">Player Two</label>
                <div className="row">
                    <div className="col-5">
                        <SearchBar 
                            value={this.state.pOneValue}
                            handleChange={this.playerOneChange}
                            autoComplete={this.playerOneChange}
                            searchName={"playerOne"}
                            data={this.state.pOneData} />
                    </div>
                    <div className="col-2">
                        <button type="submit" className="btn btn-primary">Compare</button>
                    </div>
                    <div className="col-5">
                        <SearchBar
                            value={this.state.pTwoValue}
                            handleChange={this.playerTwoChange}
                            autoComplete={this.playerTwoChange}
                            searchName={"playerTwo"}
                            data={this.state.pTwoData} />
                    </div>
                </div>
            </form>
        );
    }
}

ReactDOM.render(
    <CompareSearch />,
    document.getElementById('compare-search')
);