import './App.css';
import React from 'react';
import randomuser from "../api/randomuser";
import 'semantic-ui-css/semantic.min.css';
import {Button, Icon, List, Image} from "semantic-ui-react";

class App extends React.Component {

	state = {playersStats: []};

	getRandomUser = async () => {
		try {
			const response = await randomuser.get('', {
				params: {
					page: 1,
					results: 10,
					inc: "login, picture"
				}
			});
			let playersStats = response.data.results.map(toPlayerStats);
			this.setState({playersStats: playersStats});
		} catch (e) {
			console.log('error', e);
		}

		function toPlayerStats(item, index) {
			return {
				id: index,
				username: item.login.username,
				img: item.picture.medium,
				score: Math.trunc(Math.random() * 100),
				lastUpdate: new Date()
			}
		}
	}

	updateRandomPlayerStat = () => {
		let playerStat = this.getRandomPlayerStat();
		this.increaseScoreBy(playerStat, 10);
		this.setState({
			playersStats: this.state.playersStats
		});
	}

	increaseScoreBy = (playerStat, amount) => {
		playerStat.score += amount;
		playerStat.lastUpdate = new Date();
	}

	getRandomPlayerStat = () => {
		let randomIndex = Math.trunc(Math.random() * 10);
		return this.state.playersStats[randomIndex];
	}

	startInterval = () => {
		const intervalID = window.setInterval(() => this.updateRandomPlayerStat(), 5 * 1000);
		this.setState({...this.state, intervalID: intervalID, loading: true});
	}

	stopInterval = () => {
		window.clearInterval(this.state.intervalID);
		this.setState({...this.state, intervalID: undefined, loading: false});
	}

	componentDidMount() {
		this.getRandomUser().then();
	}

	descByScore = (a, b) => {
		return a.score < b.score ? 1 : -1;
	}

	formatDate = (date) => {
		return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}
		at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
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
					<List divided verticalAlign='middle' size="large">
						{playersStats}
					</List>
				</div>
			</div>
		);
	}
}

export default App;
