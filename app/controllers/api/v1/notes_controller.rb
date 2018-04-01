module Api::V1
  class NotesController < Api::V1::BaseController
    before_action :set_note, only: [:update, :destroy]
    def index
      #respond_with Note.all
      #notes_json = Note.includes(:tags).paginate(page: page).order(sort_by + ' ' + order).all.map{|note| note.as_json_response.merge({tags: note.tags.as_json_response})}
      render json: {
        notes: Note.paginate(page: page).order(sort_by + ' ' + order).all.map{|note| note_json(note)},
        page: page,
        pages: Note.pages
      }.as_json
    end

    def create
      respond_with :api, :v1, Note.create(note_params)
    end

    def destroy
      respond_with @note.destroy
    end

    def update
      @note.update_attributes(note_params)

      # @note.title = note_params[:title]
      # @note.body = note_params[:body]

      # tags = note_params[:tags_attributes]

      # p tags

      # if tags.present?
      #   tags.each do |tag|
      #     if tag["id"].present?
      #       note_tag = @note.tags.find(tag["id"])
      #       note_tag.tag_name = tag["tag_name"]
      #       note_tag.save!
      #     else
      #       @note.tags << Tag.new(tag_name: tag["tag_name"])
      #     end
      #   end
      # end

      # result = @note.save


      respond_with @note, json: note_json(@note).as_json
    end

    def search
      query = params[:query]
      notes = Note.or({title: /.*#{query}.*/i}).or({body: /.*#{query}.*/i}).paginate(page: page).all.map{|note| note_json(note)}.as_json
      render json: notes
    end

    private

    def note_params
      params.require(:note).permit(:id, :title, :body, tags_attributes: [:tag_name, :_destroy, :id])
    end

    def set_note
      @note = Note.find(params[:id])
    end

    def sort_by
      %w(title
         body).include?(params[:sort_by]) ? params[:sort_by] : 'title'
    end

    def order
      %w(asc desc).include?(params[:order]) ? params[:order] : 'asc'
    end

    def page
      params[:page] || 1
    end

    def note_json(note)
      {
        id: note.id,
        title: note.title,
        body: note.body,
        tags: note.tags.map do |tag|
          {
            id: tag.id,
            tag_name: tag.tag_name,
            _destroy: tag._destroy
          }
        end
      }
    end
  end
end

class Response
  def as_json(options = {})
    JSON.pretty_generate(self, options)
  end
end