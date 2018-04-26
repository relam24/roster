class LoginForm extends React.Component {
    constructor (props) {
        super (props)
        this.state = {
            username: '',
            password: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange (event) {
        this.setState({[event.target.id]: event.target.value})
    }

    handleSubmit (event) {
        event.preventDefault()
        this.props.handleSubmit(this.state);
    }

    render(){
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div>
                    <h2>Login</h2>
                        <div>
                        <label for="username">Username</label>
                            <input
                                type="text"
                                placeholder="username"
                                id="username"
                                onChange={this.handleChange}
                                value={this.state.username}
                            />
                        </div>
                        <div>
                        <label for="password">Password</label>
                            <input
                                type="text"
                                placeholder="password"
                                id="password"
                                onChange={this.handleChange}
                                value={this.state.password}
                            />
                        </div>
                        <div>
                            <input
                                type="submit"
                            />
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}
