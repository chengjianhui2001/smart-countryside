// pages/function/function.js
const db = wx.cloud.database()
const cultural_media = db.collection('cultural_media')
const key = 'ACABZ-F34HI-PWNGR-5GZBH-RTVY2-YOBPT'; //使用在腾讯位置服务申请的key
const referer = '智慧乡镇'; //调用插件的app的名称
const chooseLocation = requirePlugin('chooseLocation');


Page({
  /**
   * 页面的初始数据
   */
  data: {
    cardCur:0,
    mediaList:[],
    locationInfo:{},
    iconList: [{
      icon: 'homefill',
      color: 'red',
      name: '小镇介绍'
    }, {
      color: 'blue',
      icon: 'text',
      name:'每日普法'
    },{
      icon: 'tag',
      color: 'brown',
      name:'每日Tips'
    },{
      icon: 'taxi',
      color: 'orange',
      name: '景点推荐'
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
    this.getLocationInfo()
    // 从地图选点插件返回后，在页面的onShow生命周期函数中能够调用插件接口，取得选点结果对象
    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    if (location){
      this.setData({
        locationInfo:location
      })
      try{
        wx.setStorageSync("locationInfo",location)
        console.log("数据信息缓存成功")
      }catch (e) {
        console.log(e)
      }
    }
  },
  //获取位置信息
  getLocationInfo(){
    let location = wx.getStorageSync('locationInfo')
    if (location){
      this.setData({
        locationInfo:location
      })
    }
  },
  //页面卸载
  onUnload () {
    // 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
    chooseLocation.setLocation(null);
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
  },
  //跳转地图插件页面
  choose_location(){
    wx.navigateTo({
      url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer
    });
  },
})