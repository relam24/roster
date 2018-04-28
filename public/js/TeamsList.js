
class TeamsList extends React.Component {
	render () {
      // console.log(this.props.players);
		return (
			<table>
				<tbody>
				<button onClick={() =>
					this.props.toggleState('teamsListIsVisible')}>Cancel</button>
					{this.props.teams.map((team, index) => {
						return <tr>
							<td onClick={() => {
								this.props.toggleState('teamsListIsVisible', 'teamIsVisible'); this.props.getTeam(team);
							}}>
								<h2>{team.team_name}</h2>
							</td>
							<td className="playerstatus">
								<h3> {team.roster} </h3>
							</td>
							<button className="edit"
								onClick={() => {
									this.props.toggleState('teamsListIsVisible', 'teamIsVisible'); this.props.getTeam(team);
								}}>Edit</button>
							<button className="delete"
								onClick={() => {
									this.props.deleteTeam(team, index);
								}}>Delete</button>
						</tr>;
					})}
				</tbody>
			</table>
		);
	}
}
