class Players extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			playersListIsVisible: true,
			addPlayerIsVisible: false,
			playerIsVisible: false,
			editPlayerIsVisible: false,
			players: [],
			player: {}
		};
		this.toggleState = this.toggleState.bind(this);
		this.getPlayers = this.getPlayers.bind(this);
		this.getPlayer = this.getPlayer.bind(this);
		this.deletePlayer = this.deletePlayer.bind(this);
		this.handleCreate = this.handleCreate.bind(this);
		this.handleCreateSubmit = this.handleCreateSubmit.bind(this);
		this.handleUpdateSubmit = this.handleUpdateSubmit.bind(this);
	}

	componentDidMount () {
		this.getPlayers();
	}
	deletePlayer (player, index) {
		fetch('player/' + player.id, {
			method: 'DELETE'
		}).then(data => {
			this.setState({
				players: [
					...this.state.players.slice(0, index),
					...this.state.players.slice(index + 1)
				]
			});
		});
	}
	getPlayers () {
		fetch('/player')
		.then(response => response.json())
		.then(data => {this.setState({players: data})})
		.catch(error => console.log(error));
	}

	getPlayer (player) {
		this.setState({player: player});
	}

	handleCreate (player) {
		const updatedPlayers = this.state.players;
		updatedPlayers.unshift(player);
		this.setState({
			players: updatedPlayers
		});
	}
	handleCreateSubmit (player) {
		fetch('/player', {
			body: JSON.stringify(player),
			method: 'POST',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			}
		})
		.then(createdPlayer => {
			return createdPlayer.json();
		})
		.then(jsonedPlayer => {
			this.handleCreate(jsonedPlayer);
			this.toggleState('addPlayerIsVisible', 'playersListIsVisible');
		})
		.catch(error => console.log(error));
	}
	handleUpdateSubmit (player) {
		fetch('/player/' + player.id, {
			body: JSON.stringify(player),
			method: 'PUT',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			}
		})
		.then(updatedPlayer => {
			return updatedPlayer.json();
		})
		.then(jsonedPlayer => {
			this.getPlayers();
			this.toggleState('playersListIsVisible', 'playerIsVisible');
		})
		.catch(error => console.log(error));
	}
	toggleState (st1, st2) {
		this.setState({
			[st1]: !this.state[st1],
			[st2]: !this.state[st2]
		});
	}
	render () {
		console.log(this.state.players); // get players is not being called or setting state
		return (
			<div class="box">
				<h2> Players </h2>
				{ this.state.playersListIsVisible
					? <button onClick={() => this.toggleState('addPlayerIsVisible', 'playersListIsVisible')}
						>Add A Player</button> : '' }
				{ this.state.playersListIsVisible
					? <PlayersList
						toggleState={this.toggleState}
						players={this.state.players}
						getPlayer={this.getPlayer}
						deletePlayer={this.deletePlayer}
						/> : ''}
				{ this.state.addPlayerIsVisible
					? <PlayerForm
						toggleState={this.toggleState}
						handleCreate={this.handleCreate}
						handleSubmit={this.handleCreateSubmit}
						/> : ''}
				{this.state.playerIsVisible
					? <Player
						toggleState={this.toggleState}
						player={this.state.player}
						handleSubmit={this.handleUpdateSubmit}
						/> : ''}
			</div>
		);
	}
}
