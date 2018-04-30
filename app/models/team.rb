class Team
    attr_reader :id, :team_name, :roster


    if(ENV['https://heroku-roster.herokuapp.com/'])
       uri = URI.parse(ENV['https://heroku-roster.herokuapp.com/'])
       DB = PG.connect(uri.hostname, uri.port, nil, nil, uri.path[1..-1], uri.user, uri.password)
   else
       DB = PG.connect(host: "localhost", port: 5432, dbname: 'roster')
   end


    def initialize(opts = {})
        @id = opts["id"].to_i
        @team_name = opts["team_name"]
        if opts["roster"]
          @roster = opts["roster"]
        end
    end

    def self.all
      results = DB.exec(
          <<-SQL
              SELECT
                teams.*,
                player.id AS player_id,
                player.player_name,
                player.nickname,
                player.status,
                player.email,
                player.phone
              FROM teams
              LEFT JOIN player
              ON teams.id = player.teams_id
          SQL
      )
      teams = []
      current_team_id = nil
      results.each do |result|
          if result["id"] != current_team_id
              current_team_id = result["id"]
              teams.push(
                  Team.new({
                      "id" => result["id"],
                      "team_name" => result["team_name"],
                      "roster" => []
                  })
              )
          end
          if result["player_id"]
            p result
              new_player = Player.new(
                {
                  "id" => result["player_id"],
                  "player_name" => result["player_name"],
                  "nickname" => result["nickname"],
                  "status" => result["status"],
                  "email" => result["email"],
                  "phone" => result["phone"]
                }
            )
              teams.last.roster.push(new_player)
          end
      end
      return teams
    end


    def self.find(id)
        results = DB.exec(
            <<-SQL
                SELECT
                    teams.*,
                    player.id AS player_id,
                    player.player_name,
                    player.nickname,
                    player.status,
                    player.email,
                    player.phone
                FROM teams
                LEFT JOIN player
                ON teams.id = player.teams_id
                WHERE teams.id=#{id};
            SQL
        )
        roster = []
        results.each do |result|
            if result["player_id"]
                staff.push Player.new(
                  {
                    "id" => result["id"],
                    "player_name" => result["player_name"],
                    "nickname" => result["nickname"],
                    "status" => result["status"],
                    "email" => result["email"],
                    "phone" => result["phone"]
                  }
              )
            end
        end
        return Team.new({
            "id" => results.first["id"],
            "team_name" => results.first["team_name"],
            "roster" => roster
        })
    end


    def self.create(opts={})
        results = DB.exec(
            <<-SQL
                INSERT INTO teams (team_name)
                VALUES ( '#{opts["team_name"]}')
                RETURNING id, team_name
            SQL
        )
        return Team.new(results.first)
    end

    def self.delete(id)
        results = DB.exec("DELETE FROM teams WHERE id=#{id};")
        return { deleted: true }
    end


    def self.update(id, opts={})
        results = DB.exec(
            <<-SQL
                UPDATE teams
                SET team_name='#{opts["team_name"]}'
                WHERE id=#{id}
                RETURNING id, team_name;
            SQL
        )
        return Team.new(results.first)
    end

end
