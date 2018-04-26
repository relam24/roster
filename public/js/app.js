/* global ReactDOM:true */
/* global React:true */

class App extends React.Component {
	render () {
		return (
			<div>
				<Players />
			</div>
		);
	}
}

ReactDOM.render(
	<App />,
	document.querySelector('.container')
);
