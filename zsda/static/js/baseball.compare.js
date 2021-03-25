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
    }

    playerOneChange(e) {
        this.setState({pOneValue: e.target.value});
    }

    playerTwoChange(e) {
        this.setState({pTwoValue: e.target.value});
    }

    handleSubmit(e) {
        if (Object.keys(this.state.pOneData).length != 1 && Object.keys(this.state.pTwoData).length != 1) {
            alert('Please enter two valid players');
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
                <label className="form-label" htmlFor="player-one">Player One</label>
                <label className="form-label" htmlFor="player-two">Player Two</label>
                <div className="row">
                    <div className="col-5">
                        <SearchBar 
                            value={this.state.pOneValue}
                            handleChange={this.playerOneChange}
                            autoComplete={this.playerOneChange}
                            searchName={"player-one"}
                            data={this.state.pOneData} />
                    </div>
                    <div className="col-2">
                        <button type="submit" className="btn btn-primary">Search</button>
                    </div>
                    <div className="col-5">
                        <SearchBar
                            value={this.state.pTwoValue}
                            handleChange={this.playerTwoChange}
                            autoComplete={this.playerTwoChange}
                            searchName={"player-two"}
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