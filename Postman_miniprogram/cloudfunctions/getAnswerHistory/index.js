// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  const db = cloud.database()
  let count = await db.collection('use_relate_law_question').count()
  count = count.total
  let all = []
  for (let i = 0;i<count;i+=100){
    let list = await db.collection('use_relate_law_question')
        .field({
          title:true,
          score: true,
          create_time_show: true,
        })
        .orderBy('create_time', 'desc')
        .skip(i)
        .get()
    all = all.concat(list.data)
  }
  return all

}