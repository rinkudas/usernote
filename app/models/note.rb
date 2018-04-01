class Note
  include Mongoid::Document
  field :title, type: String
  field :body, type: String
  has_and_belongs_to_many :tags, autosave:true, validate: false

  validates :title, :body, presence: true

  accepts_nested_attributes_for :tags, allow_destroy: true

  class << self
    def per_page
      5
    end

    def pages(per_page = self.per_page)
      pages = count / per_page.to_f
      pages += 1 if pages % 1 > 0
      pages.to_i
    end

    def paginate(page: 1, per_page: self.per_page)
      page = page.to_i
      per_page = per_page.to_i

      offset = (page - 1) * per_page
      limit(per_page).offset(offset)
    end
  end
end