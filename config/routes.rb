Rails.application.routes.draw do
  root to: 'site#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  namespace :api do
    namespace :v1 do
      resources :notes, only: [:index, :create, :destroy, :update] do
        get :search, on: :collection
      end
    end
  end

end