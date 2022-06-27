const utils = require('../../utils/index')

Page({
    data: {
        list:[],
    },
    onLoad(){
      this.getMoment(res=>{})
    },
    getMoment(callback){
        wx.cloud.callFunction({
            name:'getMoments',
            success:res => {
                this.setData({
                    list:res.result.list
                },res=>{
                    for (let index in this.data.list){
                        this.setData({
                            [`list[${index}].create_time`]:utils.timeFormat(this.data.list[index].create_time)
                        })
                    }
                    callback()
                })
            },
            fail:err => { console.log(err) }
        })
    },
});