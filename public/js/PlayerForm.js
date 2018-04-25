/* global React:true */

class PlayerForm extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			player_name: '',
			nickname: '',
			team: '',
			status: '',
			email: '',
			phone: ''
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	componentDidMount () {
		if (this.props.player) {
			this.setState({
				player_name: this.props.player.player_name,
				nickname: this.props.player.nickname,
				team: this.props.player.team,
				status: this.props.player.status,
				email: this.props.player.email,
				phone: this.props.player.phone,
				id: this.props.player.id
			});
		}
	}
	handleChange (event) {
		this.setState({[event.target.id]: event.target.value});
	}
	handleSubmit (event) {
		event.preventDefault();
		this.props.handleSubmit(this.state);
	}
	render () {
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<label for="player_name">Player Name</label>
					<div>
						<input type="text"
							onChange={this.handleChange}
							value={this.state.player_name}
                        />
					</div>
					<label for="nickname">Nickname</label>
					<div>
						<input type="text"
							onChange={this.handleChange}
							value={this.state.nickname}
                        />
					</div>
					<label for="team">Team</label>
					<div>
						<input type="text"
							onChange={this.handleChange}
							value={this.state.team}
                        />
					</div>
					<label for="status">Status</label>
					<div>
						<input type="text"
							onChange={this.handleChange}
							value={this.state.status}
                        />
					</div>
					<label for="email">Email</label>
					<div>
						<input type="text"
							onChange={this.handleChange}
							value={this.state.email}
                        />
					</div>
					<label for="phone">Phone</label>
					<div>
						<input type="text"
							onChange={this.handleChange}
							value={this.state.phone}
                        />
					</div>
					<div>
						<input type="submit"
                        />
					</div>
				</form>
				<button onClick={() =>
                    this.props.toggleState('addPlayerIsVisible', 'playersListIsVisible')}>Cancel</button>
			</div>
		);
	}
}
