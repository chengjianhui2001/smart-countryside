// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {

  // //获取记录总数
  // let count = await db.collection('activity').count()
  // count = count.total
  // //通过for循环，把多次请求获得的数据拼接到一起。
  // let all = []
  //设置i每次获取的量
  // for(let i = 0; i < count; i+=100){
  //   let list = db.collection('activity').aggregate()
  //       .match({
  //         type:'activity'
  //       }).sort({
  //         create_time: -1
  //       }).lookup({
  //         from: 'user',
  //         localField: 'user_id',
  //         foreignField: '_id',
  //         as: 'userInfo',
  //       }).skip(i).end()
  //   all = all.concat(list.list)
  // }
  // //返回数组
  // return all
    return  db.collection('activity').aggregate()
        .match({
            type:'activity'
        }).sort({
            create_time: -1
        }).lookup({
            from: 'user',
            localField: 'user_id',
            foreignField: '_id',
            as: 'userInfo',
        }).end()
}