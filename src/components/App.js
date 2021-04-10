import './App.css';
import React from 'react';
import randomuser from "../api/randomuser";
import Item from "./Item";

/*let json = {
	id: 1,
	login.username: 'nayer30',
	score: 3,
	picture.medium: '...',
	lastUpdate: new Date()
}*/

class App extends React.Component {

    state = {playersStats: []};

    getRandomUser = async () => {
        try {
            const a = await randomuser.get('', {
                params: {
                    page: 1,
                    results: 10,
                    inc: "login, picture"
                }
            });
            console.log(a.data.results);
            let playersStats = a.data.results.map((item, index) => {
                return {
                    id: index,
                    username: item.login.username,
                    img: item.picture.medium,
                    score: Math.random() * 100,
                    lastUpdate: new Date(2020, Math.random() * 10, 3)
                }
            });
            console.log(playersStats);
            this.setState({playersStats: playersStats});
        } catch (e) {
            console.log('error', e);
        }
    }

    componentDidMount() {
        this.getRandomUser().then();
    }

    render() {
        const playersStats = this.state.playersStats.map(playerStat => {
            return (
                <div key={playerStat.id}>{playerStat.username}</div>
            )
        })

        return (
            <div>
                {playersStats}
            </div>
        );
    }
}

export default App;
