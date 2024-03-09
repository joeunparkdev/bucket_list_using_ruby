class Item
    include Mongoid::Document
    field :text, type: String
    field :done, type: Boolean, default: false
  end
  