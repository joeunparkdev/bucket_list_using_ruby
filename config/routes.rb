Rails.application.routes.draw do
    resources :items, only: [:index, :create, :update, :destroy]
  end
  