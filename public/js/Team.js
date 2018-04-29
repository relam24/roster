class Team extends React.Component {
	render () {
		return (
			<div>
				<div>
					<div className="playerinfo">
						<h2> {this.props.team.team_name} </h2>
						<div>
							<button onClick={() => this.props.toggleState('teamsListIsVisible', 'teamIsVisible')}>Roster</button>
						</div>
					</div>
				</div>
				<div className="playerformrun">
					<TeamForm team={this.props.team} handleSubmit={this.props.handleSubmit} />
				</div>
			</div>
		);
	}
}
