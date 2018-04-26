class Players extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			userFormIsVisbile: true,
			loginButtonIsVisbile: true,
			playersListIsVisible: true,
			addUserIsVisible: false,
			loginUserIsVisible: false,
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
		this.handleCreateUserSubmit = this.handleCreateUserSubmit.bind(this);
		this.handleCreateLoginSubmit = this.handleCreateLoginSubmit.bind(this);
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

	handleUserCreate (user) {
		const updatedUser = this.state.user
		updatedUser.push(user)
		this.setState({user: updatedUser})
	}


	handleLoginCreate (login) {
		const updatedLogin = this.state.login
		updatedLogin.push(login)
		this.setState({login: updatedLogin})
	}


	handleCreate (player) {
		const updatedPlayers = this.state.players;
		updatedPlayers.unshift(player);
		this.setState({
			players: updatedPlayers
		});
	}


	
		handleCreateUserSubmit (user) {
			fetch('/user' , {
				body: JSON.stringify(user),
				method: 'POST',
				headers: {
					'Aceept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				}
			})
			.then(createdUser => {
				return createdUser.json()
			})
			.then(jsonedUser => {
				this.handleUserCreate(jsonedUser)
				this.toggleState('addUserIsVisible', 'playersListIsVisible')
			})
			.catch(error => console.log(error))
		}

		handleCreateLoginSubmit (login) {
			fetch('/login' , {
				body: JSON.stringify(login),
				method: 'POST',
				headers: {
					'Aceept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				}
			})
			.then(jsonedLogin => {
				this.handleLoginCreate(jsonedLogin)
				this.toggleState('loginUserIsVisible', 'playersListIsVisible')
			})
			.catch(error => console.log(error))
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
				{!this.state.addUserIsVisible ?
					 this.state.userFormIsVisbile
						? <button onClick={() =>
						this.toggleState('addUserIsVisible', 'playersListIsVisible')}
						>Create New Account</button> : '' : this.state.userFormIsVisbile
   						? <button onClick={() =>
   						this.toggleState('addUserIsVisible', 'playersListIsVisible')}
   						>Cancel</button> : ''}
				{!this.state.loginUserIsVisible ?
					this.state.loginButtonIsVisbile
					? <button onClick={() =>
					this.toggleState('loginUserIsVisible', 'playersListIsVisible')}
					>Login</button> : '' : this.state.loginButtonIsVisbile
		   			? <button onClick={() =>
		   			this.toggleState('loginUserIsVisible', 'playersListIsVisible')}
					>Cancel</button> : ''}
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
				{this.state.addUserIsVisible
					? <UserForm
						toggleState={this.toggleState}
						handleCreate={this.handleUserCreate}
						handleSubmit={this.handleCreateUserSubmit}
						/> : ''}
				{this.state.loginUserIsVisible
					? <LoginForm
						toggleState={this.toggleState}
						handleCreate={this.handleLoginCreate}
						handleSubmit={this.handleCreateLoginSubmit}
						/> : ''}
			</div>
		);
	}
}
