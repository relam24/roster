/* global ReactDOM:true */
/* global React:true */

class App extends React.Component {
	render () {
		return (
			<div>
				<h1>Roster</h1>
				<Players />
			</div>
		);
	}
}

ReactDOM.render(
	<App />,
	document.querySelector('.container')
);
