module Api::V1
  class NotesController < Api::V1::BaseController
    before_action :set_note, only: [:update, :destroy]
    def index
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
      @note.tags.clear

      @note.update_attributes(note_params)

      respond_with @note, json: note_json(@note).as_json
    end

    def search
      query = params[:query]
      notes = Note.or({title: /.*#{query}.*/i}).or({body: /.*#{query}.*/i}).paginate(page: page).all.map{|note| note_json(note)}.as_json
      render json: notes
    end

    private

    def note_params
      params.require(:note).permit(:id, :title, :body, tags_attributes: [:tag_name, :id])
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