class PlayersList extends React.Component {
  render (){
      // console.log(this.props.people);
    return (
      <table>
        <tbody>
        {this.props.players.map((player, index)=>{
          return <tr>
            <td onClick={()=> {this.props.toggleState('playersListIsVisible', 'playerIsVisible'); this.props.getPlayer(player)}}>
              <h2>{player.name}</h2>
            </td>
            <td className='player'>
              <h3> {player.name} </h3>
            </td>
            <td onClick={()=> {this.props.toggleState('playersListIsVisible', 'playerIsVisible'); this.props.getPlayer(player)}}>
                <button className='button is-warning is-small'>Edit</button>
            </td>
            <td onClick={()=> {this.props.deletePlayer(player, index)}}>
                <button className='button is-danger is-small'>Delete</button>
            </td>
          </tr>
          })}
        </tbody>
      </table>
    )
  }
}
