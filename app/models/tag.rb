class Tag
  include Mongoid::Document
  field :tag_name, type: String
  has_and_belongs_to_many :notes, autosave:true, validate: false
end