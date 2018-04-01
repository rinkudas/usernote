module Api::V1
  class BaseController < ApplicationController
  	skip_before_action :verify_authenticity_token
    respond_to :json
  end
end