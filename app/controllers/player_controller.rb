class PlayerController < ApplicationController
	skip_before_action :verify_authenticity_token

	#index
	def index
		render json: Player.all
	end

	# get one by id
	def show
		render json: Player.find(params["id"])
	end

	# create one
	def createOne
		render json: Player.create(params["player"])
	end

	# delete one by id
	def delete
		render json: Player.delete(params["id"])
	end

	#update one by id
	def update
		render json: Player.update(params["id"], params["player"])
	end
end
