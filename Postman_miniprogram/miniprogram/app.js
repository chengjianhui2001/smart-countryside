// app.js
App({
  //引入 `towxl3.0`解析方法
  towxml:require('/towxml/index'),
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'cloud1-5g1oimlb11d4eb78',
        traceUser: true,
      });
    }

    wx.cloud.callFunction({
      name: 'get_openId',
      success: res => {
        //获取用户openid
        console.log("启动程序----获取用户openId",res)
        this.globalData.user_openid = res.result.openid
        try {
          wx.setStorageSync('_openid',  res.result.openid)
          console.log('缓存_openid',wx.getStorageSync('_openid'))
        } catch (e) { console.log(e) }
        wx.cloud.database().collection('user').where({
          _openid:res.result.openid
        }).get({
          success:res => {
            console.log('根据openId查询数据库中是否存在该用户',res)
            this.globalData.userInfo = res.data[0]
            if (res.data.length===0){
              console.log('数据库中不存在该用户')
            }else {
              try {
                wx.setStorageSync('userInfo', res.data[0])
                console.log('缓存userInfo',wx.getStorageSync('userInfo'))
              } catch (e) { console.log(e) }
            }
          }
        })
      }
    })

    this.globalData = {
      //用户openid
      user_openid: null,
      //用户信息
      userInfo: {},
      //全局数据管理
      Custom: 0,
      CustomBar: 0,
      StatusBar:0
    };

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
  },
});
