// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const news = db.collection('news')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return await news.add({
      data:{
        title: event.title,
        content: event.content,
        tags: event.tags,
        fileIds: event.fileIds
      }
  })
}