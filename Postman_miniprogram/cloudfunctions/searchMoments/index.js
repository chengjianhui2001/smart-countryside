// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const _ = db.command

  return db.collection('moment')
      .aggregate()
      .match({
        content: db.RegExp({
          regexp:event.value,
          options:'i'
        })
      })
      .sort({
        createTime: -1
      })
      .lookup({
        from: 'user',
        localField: 'user_id',
        foreignField: '_id',
        as: 'user',
      }).end()
}