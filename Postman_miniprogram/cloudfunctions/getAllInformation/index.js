// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  return  db.collection('activity').aggregate()
      .match({
          user_id:event.user_id
      })
      .sort({
        create_time: -1
      }).lookup({
        from: 'user',
        localField: 'user_id',
        foreignField: '_id',
        as: 'userInfo',
      }).end()
}