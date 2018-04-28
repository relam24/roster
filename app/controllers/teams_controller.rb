class TeamsController < ApplicationController

    skip_before_action :verify_authenticity_token

    # get index (all)
    def index
      render json: Team.all
    end

    # get one (by id)
    def show
      render json: Team.find(params["id"])
    end

    # create just the company
    def create
      render json: Team.create(params["team"])
    end

    # create a company with staff
    def createWithRoster
      created_location = Team.create(params["team"])
      if params["id"]
        updated_player = Player.setTeam(params["id"], created_location)
      end
      render json: created_location
    end

    # delete one (by id)
    def delete
      render json: Team.delete(params["id"])
    end

    # update one (by id)
    def update
      render json: Team.update(params["id"], params["team"])
    end

end
