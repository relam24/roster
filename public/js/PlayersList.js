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
							<td className="player">
								<h3> {player.status} </h3>
							</td>
							<td onClick={() => {
								this.props.toggleState('playersListIsVisible', 'playerIsVisible'); this.props.getPlayer(player);
							}}>
								<button className="edit">Edit</button>
							</td>
							<td onClick={() => {
								this.props.deletePlayer(player, index);
							}}>
								<button className="delete">Delete</button>
							</td>
						</tr>;
					})}
				</tbody>
			</table>
		);
	}
}
