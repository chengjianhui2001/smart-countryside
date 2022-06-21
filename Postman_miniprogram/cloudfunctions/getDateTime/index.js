// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
    let date = new Date();
    let year = date.getFullYear();    //  返回的是年份
    let month = date.getMonth() + 1;  //  返回的月份上个月的月份，记得+1才是当月
    let dates = date.getDate();       //  返回的是几号
    let day = date.getDay();          //  周一返回的是1，周六是6，但是周日是0
    let hour= date.getHours();//得到小时数
    let minute= date.getMinutes();//得到分钟数
    let second= date.getSeconds();//得到秒数
    let arr = [ "星期日","星期一","星期二","星期三","星期四","星期五","星期六",];
    return {
      year, month, dates, hour, minute, second, day
    }
}