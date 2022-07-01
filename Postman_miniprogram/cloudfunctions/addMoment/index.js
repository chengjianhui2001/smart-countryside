// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('moment').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        user_id:event.user_id,
        content: event.content,
        fileIds: event.fileIds,
        create_time:event.create_time,
      },
    })
  } catch(e) {
    console.error(e)
  }
}