//封装获取数据库接口
const db = wx.cloud.database()

//查询数据库接口
function get({
  _collection,
  _where = {},
  _skip = 0,
  _limit = 10,
  _orderBy = {
    field: 'addtime',
    sort: 'desc'
  },
  _field = {}
}) {
  return db.collection(_collection)
  .where(_where)
  .skip(_skip)
  .limit(_limit)
  .orderBy(_orderBy.field, _orderBy.sort)
  .field(_field)
  .get()
}

//添加数据库接口
function add({
  collection,
  data
}) {
  return db.collection(collection).add({
    data
  })
}

//封装获取id读取数据库接口
function getId({
  collection,
  id
}) {
  return db.collection(collection).doc(id).get()
}

//封装一个访问量累加
function inc({collection,id,count}){
  return db.collection(collection).doc(id).update({
    data:{
      views:db.command.inc(count)
    }
  })
}

//封装根据关键字搜索
function search({collection,keyword}){
  return db.collection(collection).where({
    name:db.RegExp({
      regexp:keyword,
      options:"i"
    })
  }).get()
}

//删除
function remove({collection,where={}}){
  return db.collection(collection).where(where).remove()
}

//in查询
function query({collection,inArr}){
  return db.collection(collection).where({
    _id:db.command.in(inArr)
  }).get()
}

//修改数据记录
function update({collection,id,data}){
  return db.collection(collection).doc(id).update({
    data
  })
}

export {
  get,
  add,
  getId,
  inc,
  search,
  remove,
  query,
  update
}