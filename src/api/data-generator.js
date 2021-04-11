import randomuser from "./randomuser";

export const generatePlayersStats = async () => {
    try {
        const response = await randomuser.get('', {
            params: {
                page: 1,
                results: 10,
                inc: "login, picture"
            }
        });
        return response.data.results.map(toPlayerStats);
    } catch (e) {
        // show a message
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
