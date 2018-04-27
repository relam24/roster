
class PlayersList extends React.Component {
	render () {
      // console.log(this.props.players);
		return (
			<table>
				<tbody>
					{this.props.players.map((player, index) => {
						return <tr>
							<td onClick={() => {
								this.props.toggleState('playersListIsVisible', 'playerIsVisible'); this.props.getPlayer(player);
							}}>
								<h2>{player.player_name}</h2>
							</td>
							<td className="playerstatus">
								<h3> {player.status} </h3>
							</td>
							<button className="edit"
								onClick={() => {
									this.props.toggleState('playersListIsVisible', 'playerIsVisible'); this.props.getPlayer(player);
								}}>Edit</button>
							<button className="delete"
								onClick={() => {
									this.props.deletePlayer(player, index);
								}}>Delete</button>
						</tr>;
					})}
				</tbody>
			</table>
		);
	}
}
