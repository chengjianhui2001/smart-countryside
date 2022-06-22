// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  return db.collection('news').aggregate()
      .match({
        _id:event.newsId
      }).lookup({
        from: 'user',
        localField: 'user_id',
        foreignField: '_id',
        as: 'userInfo',
      }).end()
}