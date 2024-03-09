require 'sinatra'
require 'mongo'
require 'json'

# MongoDB 클라이언트 초기화 및 설정
configure do
  client = Mongo::Client.new([ '127.0.0.1:27017' ], :database => 'bucket_list')
  set :mongo_db, client[:bucket_list]
end

# 인덱스 생성을 위한 미들웨어 설정
before do
  indexes = settings.mongo_db.indexes.get('text')
  unless indexes
    settings.mongo_db.indexes.create_one({ text: 'text' })
  end
end

# 버킷 리스트 조회 및 렌더링
get '/' do
  @bucket_items = settings.mongo_db.find
  erb :index
end

# 새로운 아이템 추가
post '/' do
  item = { text: params['new_item'], done: false }
  settings.mongo_db.insert_one(item)
  redirect '/'
end

# 아이템 삭제
delete '/delete_item/:id' do
  settings.mongo_db.find(_id: BSON::ObjectId.from_string(params['id'])).delete_one
  redirect '/'
end

# RESTful API 엔드포인트: 모든 버킷 리스트 아이템 반환
get '/items' do
  content_type :json
  settings.mongo_db.find.to_a.to_json
end
