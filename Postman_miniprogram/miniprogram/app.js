// app.js
App({
  //引入 `towxl3.0`解析方法
  towxml:require('/towxml/index'),

  onLaunch: function () {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'cloud1-5g1oimlb11d4eb78',
        traceUser: true,
      });
    }

    wx.cloud.callFunction({
      name: 'get_openId',
      success: res => {
        //获取用户openid
        this.globalData.user_openid = res.result.openid
        try {
          wx.setStorageSync('_openid', res.result.openid)
        } catch (e) {
          console.log(e)
        }
        //根据openid判断用户是否注册过！
        wx.cloud.database().collection('user').where({
          _openid:res.result.openid
        }).get({
          success:res => {
            if (res.data.length===0){
              console.log('用户未注册')
            }else {
              try {
                wx.setStorageSync('userInfo', res.data[0])
              } catch (e) {
                console.log(e)
              }
            }
          }
        })
      }
    })

    wx.setStorage({
      key:'adminPattern',
      data:false,
      encrypt:true
    })

    this.globalData = {
      //用户openid
      user_openid: null,
      //全局数据管理
      Custom: 0,
      CustomBar: 0,
      StatusBar:0
    };

    //获取手机高度信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })

/*
    wx.cloud.getTempFileURL({
      fileList:['cloud://cloud1-5g1oimlb11d4eb78.636c-cloud1-5g1oimlb11d4eb78-1312470390/static/LongCang-Regular.ttf'],
      success:res=>{
        wx.loadFontFace({
          global: true,
          family: 'a',
          source: `url('${res.fileList[0].tempFileURL}')`,
          success(res){
            console.log("loadFontFaceSuccess",res)
          },
          fail: function (res) {
            console.log("loadFontFaceFail",res)
          },
          complete: function (res) {
            console.log("loadFontFaceComplete",res)
          }
        })
      }
    })
*/
  },
});
