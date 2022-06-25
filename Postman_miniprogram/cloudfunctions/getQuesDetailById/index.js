// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return db.collection('use_relate_law_question')
      .aggregate()
      .match({
        _id:event.id
      })
      .lookup({
        from: 'law_question',
        localField: 'questions_id',
        foreignField: '_id',
        as: 'details',
      })
      .end()

}