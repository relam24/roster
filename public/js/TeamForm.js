/* global React:true */

class TeamForm extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			team_name: '',
			roster: {}
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	componentDidMount () {
		if (this.props.team) {
			this.setState({
				team_name: this.props.team.team_name,
				roster: this.props.roster,
				id: this.props.team.id
			});
		}
	}
	handleChange (event) {
		this.setState({[event.target.id]: event.target.value});
	}
	handleSubmit (event) {
		event.preventDefault();
		console.log(this.state);
		this.props.handleSubmit(this.state);
	}
	render () {
        console.log(this.props);
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<label for="team_name">Team Name</label>
					<div>
						<input
							type="text"
							id="team_name"
							onChange={this.handleChange}
							value={this.state.team_name}
                        />
					</div>
					<div>
						<input type="submit"
                        />
					</div>
					<button onClick={() =>
						this.props.toggleState('teamsListIsVisible', 'addTeamIsVisible')}>Cancel</button>
				</form>
			</div>
		);
	}
}
