Rails.application.routes.draw do

# Routes for Player Model
get '/player', to: 'player#index'
get '/player/:id', to: 'player#show'
post '/player', to: 'player#createOne'
delete '/player/:id', to: 'player#delete'
put '/player/:id', to: 'player#update'
end
