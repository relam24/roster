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


























#     def self.all
#         results = DB.exec("SELECT * FROM player;")
#         return results.map { |result| Player.new(result) }
#     end
#
#     def self.find(id)
#         results = DB.exec("SELECT * FROM player WHERE id=#{id};")
#         return Player.new(results.first)
#     end
#
#     def self.create(opts)
#         results = DB.exec(
#             <<-SQL
#             INSERT INTO player (player_name, nickname, team, status, email, phone)
#             VALUES ('#{opts["player_name"]}', '#{opts["nickname"]}', '#{opts["team"]}', '#{opts["status"]}', '#{opts["email"]}', '#{opts["phone"]}')
#             RETURNING id, player_name, nickname, team, status, email, phone;
#             SQL
#         )
#         return Player.new(results.first)
#     end
#
#     def self.delete(id)
#         results = DB.exec("DELETE FROM player WHERE id=#{id};")
#         return {deleted:true}
#     end
#
#     def self.update(id, opts)
#         results = DB.exec(
#             <<-SQL
#             UPDATE player
#             SET player_name='#{opts["player_name"]}', nickname='#{opts["nickname"]}', team='#{opts["team"]}', status='#{opts["status"]}', email='#{opts["email"]}', phone='#{opts["phone"]}'
#             WHERE id=#{id}
#             RETURNING id, player_name, nickname, team, status, email, phone
#             SQL
#         )
#         return Player.new(results.first)
#     end
# end
