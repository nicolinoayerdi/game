import './App.css';
import React from 'react';
import randomuser from "../api/randomuser";

class App extends React.Component {

    getRandomUser = async () => {
        try {
            const a = await randomuser.get('');
            console.log(a);
        } catch (e) {
            console.log('error', e);
        }
    }

    componentDidMount() {
        this.getRandomUser().then();
    }

    render() {
        return (
            <div>App works</div>
        );
    }
}

export default App;
