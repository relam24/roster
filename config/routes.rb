Rails.application.routes.draw do

# Routes for Player Model
get '/player', to: 'player#index'
get '/player/:id', to: 'player#show'
post '/player', to: 'player#createOne'
post '/teams/:id/roster', to: 'player#createForTeam'
delete '/player/:id', to: 'player#delete'
put '/player/:id', to: 'player#update'


get '/teams', to: 'teams#index'
get '/teams/:id', to: 'teams#show'
post '/teams', to: 'teams#create'
post '/player/:id/team', to: 'teams#createWithRoster'
delete '/teams/:id', to: 'teams#delete'
put '/teams/:id', to: 'teams#update'
end
