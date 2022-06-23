// pages/function2/function2.js
const db = wx.cloud.database()
const cultural_media = db.collection('cultural_media')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cardCur:0,
    mediaList:[],
    iconList: [{
      icon: 'cardboardfill',
      color: 'red',
      name: 'VR'
    }, {
      icon: 'recordfill',
      color: 'orange',
      name: '录像'
    }, {
      icon: 'picfill',
      color: 'yellow',
      name: '图像'
    }, {
      icon: 'noticefill',
      color: 'olive',
      name: '通知'
    }, {
      icon: 'upstagefill',
      color: 'cyan',
      name: '排行榜'
    }, {
      icon: 'clothesfill',
      color: 'blue',
      name: '皮肤'
    }, {
      icon: 'discoverfill',
      color: 'purple',
      name: '发现'
    }, {
      icon: 'questionfill',
      color: 'mauve',
      name: '帮助'
    }, {
      icon: 'commandfill',
      color: 'purple',
      name: '问答'
    }, {
      icon: 'brandfill',
      color: 'mauve',
      name: '版权'
    }],
    gridCol:4,
  },

  //监听卡片播放
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  //监听列数选择
  switchColumns(e){
    if (!e.detail.value){
      this.setData({
        gridCol:4
      })
    }else {
      this.setData({
        gridCol:3
      })
    }
  },
  //监听页面
  onShow:function () {
    this.getMedia()
  },

  //获取轮播展示视频
  getMedia(){
    cultural_media.where({
      is_selected: "A"
    }).get({
      success: res => {
        this.setData({
          mediaList:res.data
        })
      }
    })

  }
})