import './App.css';
import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import {Button, Icon, List, Image} from "semantic-ui-react";
import format from 'date-fns/format'
import {generatePlayersStats} from "../api/data-generator";

class App extends React.Component {

	state = {playersStats: [], intervalID: undefined, loading: false};

	componentDidMount() {
		generatePlayersStats().then(playersStats => this.setState({playersStats: playersStats}));
	}

	startInterval = () => {
		const intervalID = window.setInterval(() => this.updateRandomPlayerStat(), 10 * 1000);
		this.setState({...this.state, intervalID: intervalID, loading: true});
	}

	stopInterval = () => {
		window.clearInterval(this.state.intervalID);
		this.setState({...this.state, intervalID: undefined, loading: false});
	}

	updateRandomPlayerStat = () => {
		let playerStat = this.getRandomPlayerStat();
		this.increaseScoreBy(playerStat, 10);
	}

	increaseScoreBy = (playerStat, amount) => {
		playerStat.score += amount;
		playerStat.lastUpdate = new Date();
		this.setState({...this.state, playerStats: this.state.playersStats});
	}

	getRandomPlayerStat = () => {
		let randomIndex = Math.trunc(Math.random() * 10);
		return this.state.playersStats[randomIndex];
	}

	descByScore = (a, b) => {
		return a.score < b.score ? 1 : -1;
	}

	formatDate = (date) => {
		return format(date, "yyyy-MM-dd' at 'HH:mm:ss");
	}

	render() {
		const playersStats = this.state.playersStats
			.sort(this.descByScore)
			.map(playerStats => {
				return (
					<List.Item key={playerStats.id}>
						<Image avatar src={playerStats.img}/>
						<List.Content>
							<List.Header>{playerStats.username}</List.Header>
							<List.Description>
								<span>{`Last update `}</span>
								<b>{this.formatDate(playerStats.lastUpdate)}</b>
							</List.Description>
						</List.Content>
						<List.Content floated='right'>
							<div>{`Score ${playerStats.score}`}</div>
						</List.Content>
					</List.Item>
				)
			});

		let buttonStart = this.state.loading ? (<Button loading>Loading</Button>) :
			(<Button onClick={() => this.startInterval()}>
				<Icon name='play'/>
				Start
			</Button>)

		return (
			<div>
				<div className="list-container">
					{buttonStart}
					<Button onClick={() => this.stopInterval()}>
						<Icon name='pause'/>
						Pause
					</Button>
					<List divided verticalAlign='middle' size="medium">
						{playersStats}
					</List>
				</div>
			</div>
		);
	}
}

export default App;
