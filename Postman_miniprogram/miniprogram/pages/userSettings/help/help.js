// pages/userSettings/help/help.js
import Notify from '../../../miniprogram_npm/@vant/weapp/notify/notify';

const db = wx.cloud.database()
const feedback = db.collection('feedback')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNames: [],
    feedback:null,
  },

  /**
   * 控制折叠面板*/
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  onOpen(event) {},
  onClose(event) {},

  /**
   * 重置反馈框*/
  handleReset(){
    this.setData({
      feedback:null
    })
  },

  /**
   * 提交反馈信息*/
  handleSubmit(){
    feedback.add({
      data: {
        feedback: this.data.feedback
      }
    }).then( res  =>{
      Notify({
        type:'success',
        message:'反馈成功'
      })
      this.handleReset()
      this.setData({
        activeNames:[]
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

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