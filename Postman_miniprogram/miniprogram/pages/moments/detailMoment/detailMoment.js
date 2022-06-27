const utils = require('../../../utils/index')

Page({
    data: {
        moment:null,
    },
    onLoad: function (options) {
        let moment = JSON.parse(options.moment)
        this.setData({
            moment:moment
        },res=>{
            for (let index in this.data.list){
                this.setData({
                    'moment.create_time':utils.timeFormat(this.data.create_time)
                })
            }
        })
    }
});