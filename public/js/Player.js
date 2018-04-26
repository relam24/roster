class Player extends React.Component {
	render () {
		return (
			<div>
				<div>
					<div className="playerinfo">
						<h2> {this.props.player.player_name} </h2>
						<p><span>Nickame:</span> {this.props.player.nickname}</p>
						<p><span>Team:</span> {this.props.player.team}</p>
						<p><span>Status:</span> {this.props.player.status} </p>
						<p><span>Email:</span> {this.props.player.email} </p>
						<p><span>Phone:</span> {this.props.player.phone} </p>
						<div>
							<button onClick={() => this.props.toggleState('playersListIsVisible', 'playerIsVisible')}>Roster</button>
						</div>
					</div>
				</div>
				<div className="playerformrun">
					<PlayerForm player={this.props.player} handleSubmit={this.props.handleSubmit} />
				</div>
			</div>
		);
	}
}
