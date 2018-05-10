# Roster

Roster Live Site https://heroku-roster.herokuapp.com/

SUMMARY/DESCRIPTION: Roster is an app dedicated to all sports team that want to have an interactive way to see all teammates and players' info. Most teams including mine, use an excel sheet to keep tabs and that leads to a lot of unneeded data. Roster is a way to optimize that info and be able to quickly find what you are looking for.

Technologies Used: Ruby, Rails, Postgres SQL, React with full CRUD.

APPROACH TAKEN: In the beginning we were really focused on just one model which was players. We ended up adding another model which was focused on all teams. In that way, you could put teams in the database that are competitors. This app is really going to be able to used by any sport that is a team sport and requires a roster, as well as keeping tabs every team in the league. We added login and authorization which we had some trouble with, but definitely something we will end up going back to. The homepage was also added to give the user a description on how to use the app. All in all, we are all very happy for how it has turned out thus far. Our team balanced each other out very well.

It was great working with Alec and Tate, we really worked together well but we were also able to go off on our own and take care of the specific problems we were looking to solve. We definitely worked off of eachother's strengths.

Code Snippet--- Ruby and Rails with postgreSQL, React.

Player model
class Player

    attr_reader :id, :player_name, :nickname, :team, :status, :email, :phone

    DB = PG.connect(host: "localhost", port: 5432, dbname: 'roster')

    def initialize(opts)
        @id = opts["id"].to_i
        @player_name = opts["player_name"]
        @status = opts["status"]
        @email = opts["email"]
        @phone = opts["phone"]
        if opts["nickname"]
            @nickname = opts["nickname"]
        end
        if opts["team"]
            @teams_id = opts["team"]
        end
    end

    def self.all
          results = DB.exec(
              <<-SQL
                  SELECT
                      player.*,
                      teams.team_name
                  FROM player
                  LEFT JOIN teams
                      ON player.teams_id = teams.id
              SQL
          )
          return results.map do |result|
                if result["teams_id"]
                    team = Team.new(
                        {
                            "id" => result["teams_id"],
                            "team_name" => result["team_name"]
                        }
                    )
                else
                    company = nil
                end
                Player.new(
                    {
                        "id" => result["id"],
                        "player_name" => result["player_name"],
                        "nickname" => result["nickname"],
                        "team" => team,
                        "phone" => result["phone"],
                        "status" => result["status"],
                        "email" => result["email"]
                    }
                )
            end
        end


        def self.find(id)
            results = DB.exec(
                <<-SQL
                    SELECT
                        player.*,
                        teams.team_name
                    FROM player
                    LEFT JOIN teams
                        ON player.teams_id = teams.id
                    WHERE player.id=#{id};
                SQL
            )
            result = results.first
            if result["teams_id"]
                team = Team.new(
                    {
                        "id" => result["teams_id"],
                        "team_name" => result["team_name"]
                    }
                )
            else
                team = nil
            end
            player =  Player.new(
                {
                  "id" => result["id"],
                  "player_name" => result["player_name"],
                  "nickname" => result["nickname"],
                  "team" => team,
                  "phone" => result["phone"],
                  "status" => result["status"],
                  "email" => result["email"]
                }
            )
            return player
        end


        def self.create(opts={})
          results = DB.exec(
              <<-SQL
                  INSERT INTO player (player_name, nickname, phone, status, email, teams_id)
                  VALUES (
                    '#{opts["player_name"]}',
                     '#{opts["nickname"]}',
                     '#{opts["phone"]}',
                     '#{opts["status"]}',
                     '#{opts["email"]}',
                    #{opts["teams_id"] ? opts["teams_id"] : "NULL"} )
                  RETURNING id, player_name, nickname, phone, status, email, teams_id;
              SQL
          )
          return Player.new(results.first)
        end


        def self.delete(id)
          results = DB.exec("DELETE FROM player WHERE id=#{id};")
          return { deleted: true }
        end


        def self.update(id, opts={})
          results = DB.exec(
              <<-SQL
                  UPDATE player
                  SET
                   player_name='#{opts["player_name"]}',
                   nickname='#{opts["nickname"]}',
                   phone='#{opts["phone"]}',
                   status='#{opts["status"]}',
                   email='#{opts["email"]}',
                   teams_id=#{opts["teams_id"] ? opts["teams_id"] : "NULL"}
                  WHERE id=#{id}
                  RETURNING id, player_name, nickname, phone, status, email, teams_id;
              SQL
          )
          return Player.new(results.first)
        end


        def self.setTeam(player_id, team)
        results = DB.exec(
            <<-SQL
                UPDATE player
                SET teams_id = #{teams.id}
                WHERE id = #{player_id}
                RETURNING id, player_name, nickname;
            SQL
        )
        return Player.new(results.first)
      end
    end
    
    =================================================== REACT
    class Players extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			userFormIsVisbile: true,
			loginButtonIsVisbile: true,
			playersListIsVisible: false,
			teamsListIsVisible: false,
			homeButtonIsVisible: false,
			addUserIsVisible: false,
			loginUserIsVisible: false,
			addPlayerIsVisible: false,
			addTeamIsVisible: false,
			playerIsVisible: false,
			teamIsVisible: false,
			editPlayerIsVisible: false,
			editTeamIsVisible: false,
			players: [],
			player: {},
			teams: [],
			team: {}
		};
		this.toggleState = this.toggleState.bind(this);
		this.getTeams = this.getTeams.bind(this);
		this.getTeam = this.getTeam.bind(this);
		this.getPlayers = this.getPlayers.bind(this);
		this.getPlayer = this.getPlayer.bind(this);
		this.deletePlayer = this.deletePlayer.bind(this);
		this.deleteTeam = this.deleteTeam.bind(this);
		this.handleCreate = this.handleCreate.bind(this);
		this.handleCreateTeam = this.handleCreateTeam.bind(this);
		this.handleCreateSubmit = this.handleCreateSubmit.bind(this);
		this.handleUpdateSubmit = this.handleUpdateSubmit.bind(this);
		this.handleCreateTeamSubmit = this.handleCreateTeamSubmit.bind(this);
		this.handleUpdateTeamSubmit = this.handleUpdateTeamSubmit.bind(this);
	}

	componentDidMount () {
		this.getTeams();
		this.getPlayers();
	}



	deletePlayer (player, index) {
		fetch('player/' + player.id, {
			method: 'DELETE'
		}).then(data => {
			this.setState({
				players: [
					...this.state.players.slice(0, index),
					...this.state.players.slice(index + 1)
				]
			});
		});
	}

	deleteTeam (team, index) {
		fetch('teams/' + team.id, {
			method: 'DELETE'
		}).then(data => {
			this.setState({
				teams: [
					...this.state.teams.slice(0, index),
					...this.state.teams.slice(index + 1)
				]
			});
		});
	}


	getPlayers () {
		fetch('/player')
		.then(response => response.json())
		.then(data => {
			this.setState({players: data});
		})
		.catch(error => console.log(error));
	}

	getTeams () {
		fetch('/teams')
		.then(response => response.json())
		.then(data => {
			this.setState({teams: data});
		})
		.catch(error => console.log(error));
	}

	getPlayer (player) {
		this.setState({player: player});
	}

	getTeam (team) {
		this.setState({team: team});
	}

	handleCreateTeam (team) {
		const updatedTeams = this.state.teams;
		updatedTeams.unshift(team);
		this.setState({
			teams: updatedTeams
		});
	}

	handleCreate (player) {
		const updatedPlayers = this.state.players;
		updatedPlayers.unshift(player);
		this.setState({
			players: updatedPlayers
		});
	}

	handleUserCreate (user) {
		const updatedUser = this.state.user
		updatedUser.push(user)
		this.setState({user: updatedUser})
	}


	handleLoginCreate (login) {
		const updatedLogin = this.state.login
		updatedLogin.push(login)
		this.setState({login: updatedLogin})
	}

	// handleCreateUserSubmit (user) {
	// 		fetch('/user' , {
	// 			body: JSON.stringify(user),
	// 			method: 'POST',
	// 			headers: {
	// 				'Aceept': 'application/json, text/plain, */*',
	// 				'Content-Type': 'application/json'
	// 			}
	// 		})
	// 		.then(createdUser => {
	// 			return createdUser.json()
	// 		})
	// 		.then(jsonedUser => {
	// 			this.handleUserCreate(jsonedUser)
	// 			this.toggleState('addUserIsVisible', 'playersListIsVisible')
	// 		})
	// 		.catch(error => console.log(error))
	// 	}

	handleCreateUserSubmit () {
		this.toggleState('userFormIsVisbile', 'addUserIsVisible')
	}

	handleCreateLoginSubmit () {
		this.toggleState('loginButtonIsVisbile', 'loginUserIsVisible')
	}

		// handleCreateLoginSubmit (login) {
		// 	fetch('/login' , {
		// 		body: JSON.stringify(login),
		// 		method: 'POST',
		// 		headers: {
		// 			'Aceept': 'application/json, text/plain, */*',
		// 			'Content-Type': 'application/json'
		// 		}
		// 	})
		// 	.then(jsonedLogin => {
		// 		this.handleLoginCreate(jsonedLogin)
		// 		this.toggleState('loginUserIsVisible', 'playersListIsVisible')
		// 	})
		// 	.catch(error => console.log(error))
		// }

	handleCreateSubmit (player) {
		fetch('/player', {
			body: JSON.stringify(player),
			method: 'POST',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			}
		})
		.then(createdPlayer => {
			return createdPlayer.json();
		})
		.then(jsonedPlayer => {
			this.handleCreate(jsonedPlayer);
			this.toggleState('addPlayerIsVisible', 'playersListIsVisible');
		})
		.catch(error => console.log(error));
	}

	handleCreateTeamSubmit (team) {
		fetch('/teams', {
			body: JSON.stringify(team),
			method: 'POST',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			}
		})
		.then(createdTeam => {
			return createdTeam.json();
		})
		.then(jsonedTeam => {
			this.handleCreate(jsonedTeam);
			this.toggleState('addTeamIsVisible', 'teamsListIsVisible');
		})
		.catch(error => console.log(error));
	}

	handleUpdateSubmit (player) {
		fetch('/player/' + player.id, {
			body: JSON.stringify(player),
			method: 'PUT',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			}
		})
		.then(updatedPlayer => {
			return updatedPlayer.json();
		})
		.then(jsonedPlayer => {
			this.getPlayers();
			this.toggleState('playersListIsVisible', 'playerIsVisible');
		})
		.catch(error => console.log(error));
	}

	handleUpdateTeamSubmit (team) {
		fetch('/teams/' + team.id, {
			body: JSON.stringify(team),
			method: 'PUT',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			}
		})
		.then(updatedTeam => {
			return updatedTeam.json();
		})
		.then(jsonedTeam => {
			this.getTeams();
			this.toggleState('teamsListIsVisible', 'teamIsVisible');
		})
		.catch(error => console.log(error));
	}

	toggleState (st1, st2) {
		this.setState({
			[st1]: !this.state[st1],
			[st2]: !this.state[st2]
		});
	}
	render () {
		console.log(this.state.players); // get players is not being called or setting state
		return (
			<div class="box">
			{!this.state.addUserIsVisible ?
					 this.state.userFormIsVisbile
						? <button onClick={() =>
						this.toggleState('addUserIsVisible')}
						>Create New Account</button> : '' : this.state.userFormIsVisbile
   						? <button onClick={() =>
   						this.toggleState('addUserIsVisible')}
   						>Cancel</button> : ''}
				{!this.state.loginUserIsVisible ?
					this.state.loginButtonIsVisbile
					? <button onClick={() =>
					this.toggleState('loginUserIsVisible')}
					>Login</button> : '' : this.state.loginButtonIsVisbile
		   			? <button onClick={() =>
		   			this.toggleState('loginUserIsVisible')}
					>Cancel</button> : ''}
				{this.state.loginButtonIsVisbile ?
				<h3 className="playerinfo">Welcome! Through this app you can create update delete and display your whole teams roster. You can add as many players or teams as you would like. Create a free account to get started!</h3> : ''}
				{!this.state.loginButtonIsVisbile && !this.state.userFormIsVisbile
					? <button onClick={()=>
						this.toggleState('teamsListIsVisible')}
						>Teams</button> : ''}
				{!this.state.loginButtonIsVisbile && !this.state.userFormIsVisbile
					? <button onClick={()=>
						this.toggleState('playersListIsVisible')}
						>Players</button> : ''}
				{this.state.teamsListIsVisible
					? <button onClick={()=>
						this.toggleState('addTeamIsVisible', 'teamsListIsVisible')}
						>Add A Team</button> : '' }
				<h2 className="title"> Players </h2>
				{ this.state.playersListIsVisible
					? <button className="addplayer" onClick={() => this.toggleState('addPlayerIsVisible', 'playersListIsVisible')}
						>Add A Player</button> : '' }
				{ this.state.playersListIsVisible
					? <PlayersList
						toggleState={this.toggleState}
						players={this.state.players}
						getPlayer={this.getPlayer}
						deletePlayer={this.deletePlayer}
						/> : ''}
				{ this.state.addPlayerIsVisible
					? <PlayerForm
						toggleState={this.toggleState}
						handleCreate={this.handleCreate}
						handleSubmit={this.handleCreateSubmit}
						/> : ''}
						{this.state.playerIsVisible
							? <Player
								toggleState={this.toggleState}
								player={this.state.player}
								handleSubmit={this.handleUpdateSubmit}
								/> : ''}
						{ this.state.teamsListIsVisible
							? <TeamsList
								toggleState={this.toggleState}
								teams={this.state.teams}
								getTeam={this.getTeam}
								deleteTeam={this.deleteTeam}
								/> : ''}
						{ this.state.addTeamIsVisible
							? <TeamForm
								toggleState={this.toggleState}
								handleCreate={this.handleCreateTeam}
								handleSubmit={this.handleCreateTeamSubmit}
								/> : ''}
						{this.state.teamIsVisible
							? <Team
								toggleState={this.toggleState}
								team={this.state.team}
								handleSubmit={this.handleUpdateTeamSubmit}
								/> : ''}
				{this.state.addUserIsVisible
					? <UserForm
						toggleState={this.toggleState}
						handleCreate={this.handleUserCreate}
						handleSubmit={this.handleCreateUserSubmit}
						/> : ''}
				{this.state.loginUserIsVisible
					? <LoginForm
						toggleState={this.toggleState}
						handleCreate={this.handleLoginCreate}
						handleSubmit={this.handleCreateLoginSubmit}
					/> : ''}
			</div>
		);
	}
}
=========================================================


