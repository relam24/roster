class Player

    attr_reader :id, :player_name, :nickname, :team, :status, :email, :phone

    DB = PG.connect(host: "localhost", port: 5432, dbname: 'roster')

    def initialize(opts)
        @id = opts["id"].to_i
        @player_name = opts["player_name"]
        if opts["nickname"]
            @nickname = opts["nickname"]
        end
        @team = opts["team"]
        @status = opts["status"]
        @email = opts["email"]
        @phone = opts["phone"]
    end

    def self.all
        results = DB.exec("SELECT * FROM player;")
        return results.map { |result| Player.new(result) }
    end

    def self.find(id)
        results = DB.exec("SELECT * FROM player WHERE id=#{id};")
        return Player.new(results.first)
    end

    def self.create(opts)
        results = DB.exec(
            <<-SQL
            INSERT INTO player (player_name, nickname, team, status, email, phone)
            VALUES ('#{opts["player_name"]}', '#{opts["nickname"]}', '#{opts["team"]}', '#{opts["status"]}', '#{opts["email"]}', '#{opts["phone"]}')
            RETURNING id, player_name, nickname, team, status, email, phone;
            SQL
        )
        return Player.new(results.first)
    end

    def self.delete(id)
        results = DB.exec("DELETE FROM player WHERE id=#{id};")
        return {deleted:true}
    end

    def self.update(id, opts)
        results = DB.exec(
            <<-SQL
            UPDATE player
            SET player_name='#{opts["player_name"]}', nickname='#{opts["nickname"]}', team='#{opts["team"]}', status='#{opts["status"]}', email='#{opts["email"]}', phone='#{opts["phone"]}'
            WHERE id=#{id}
            RETURNING id, player_name, nickname, team, status, email, phone
            SQL
        )
        return Player.new(results.first)
    end
end
