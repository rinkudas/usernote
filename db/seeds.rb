class Seed
attr_reader :seed
def initialize
  @seed
end

def run
  generate_data
end

def generate_data
  tags = []
  5.times do |i|
    tag = Tag.create(tag_name: "Tag#{i+1}")
    puts "Generated tag  # #{tag.id}"
    tags << tag
  end
  10.times do |i|
    note = Note.new
    note.title = "Title#{i}"
    note.body = "I am a description#{i}."
    tag_idx = rand(5)
    note.tags << tags[tag_idx]
    note.save!
    puts "Generated note  # #{note.id}"
  end
end
end

seed = Seed.new
seed.run