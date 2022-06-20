// pages/editUserInfo/editUserInfo.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
const user = db.collection('user')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname:null,
    gender:null,
    phoneNumber:null,
    province:null,
    city:null,
    detailAddress:null,
    picker: ['男','女'],
    region: ['', '', ''],
  },

  /**
   * 性别选择器*/
  PickerChange:function(e) {
    this.setData({
      gender: e.detail.value
    })
  },

  /**
   * 地址选择器
   * */
  RegionChange: function(e) {
    this.setData({
      region: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  onChange(event) {
    const { picker, value, index } = event.detail;
  },

  /**
   * 修改用户信息*/
  handleEdit(){
    user.doc(app.globalData.userInfo._id).update({
      data: {
        nickName:this.data.nickname,
        gender:parseInt(this.data.gender)+1,
        phoneNumber:this.data.phoneNumber,
        province:this.data.region[0],
        city:this.data.region[1],
        district:this.data.region[2],
        detailAddress:this.data.detailAddress,
      },
      success:res => {
        console.log(res)
      }
    })
  },

  /**
   * input框输入监听*/
  printInput:function (e){},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      nickname:app.globalData.userInfo.nickName,
      gender:parseInt(app.globalData.userInfo.gender)-1,
      phoneNumber:app.globalData.userInfo.phoneNumber,
      region:[app.globalData.userInfo.province,app.globalData.userInfo.city, app.globalData.userInfo.district,],
      detailAddress:app.globalData.userInfo.detailAddress
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})