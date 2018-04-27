class User < ApplicationRecord
    has_secure_password

    attr_reader :id, :username, :password_digest

    DB = PG.connect(host: "localhost", port: 5432, dbname: 'roster')

    def initialize(opts)
        @id = opts["id"].to_i
        @username = opts["username"]
        @password_digest = opts["password_digest"]
    end

    def self.create(opts)
        results = DB.exec(
            <<-SQL
            INSERT INTO users (username, password_digest)
            VALUES ('#{opts["username"]}', '#{opts["password_digest"]}')
            RETURNING id, username, password_digest;
            SQL
        )
        return results.first
    end

end
