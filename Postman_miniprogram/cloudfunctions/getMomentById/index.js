// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'cloud1-5g1oimlb11d4eb78'
})



// 云函数入口函数
exports.main = async (event, context) => {

  const db = cloud.database()
  const _ = db.command

  return db.collection('moment')
      .aggregate()
      .match({
        user_id:event.user_id
      })
      .sort({
        'create_time': -1,
      })
      .lookup({
        from: 'user',
        localField: 'user_id',
        foreignField: '_id',
        as: 'user',
      }).end()

}