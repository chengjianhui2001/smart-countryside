// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const news = db.collection('news')
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    console.log(event)
    return news.aggregate()
    .match(_.or([
        {
            title: db.RegExp({
                regexp:event.inputValue,
                options:'i'
            })
        },
        {
            content: db.RegExp({
                regexp:event.inputValue,
                options:'i'
            })
        }
    ]))
    .sort({
        createTime: -1
    })
    .lookup({
        from: 'user',
        localField: 'user_id',
        foreignField: '_id',
        as: 'userInfo',
    }).end()
}

/*
.match(_.or([
    {
        title: db.RegExp({
            regexp: event.inputValue,
            options: 'i',//大小写不区分
        })
    },
    {
        content: db.RegExp({
            regexp: event.inputValue,
            options: 'i'
        })
    }
]))*/
