// pages/editUserInfo/editUserInfo.js
const utils = require('../../../../utils/index')
const {el} = require("../../../../towxml/parse/parse2/entities/maps/entities");
const db = wx.cloud.database()
const user = db.collection('user')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName:null,
    gender:0,
    checked:true,
    phoneNumber:null,
    province:null,
    city:null,
    district:null,
    region: ['北京市', '北京市', '东城区'],
  },

  //性别选择器
  SwitchChange:function(e) {
    if (!e.detail.value){
      this.setData({
        gender:2,
        checked:e.detail.value
      })
    }else {
      this.setData({
        gender:1,
        checked:e.detail.value
      })
    }
  },

  //地址选择器
  RegionChange: function(e) {
    this.setData({
      region: e.detail.value
    })
  },

  //input框输入监听
  printInput:function (e){},

  //生命周期函数--监听页面显示
  onLoad() {
    try{
      let userInfo = wx.getStorageSync('userInfo')
      if (userInfo){
        this.setData({
          nickName:userInfo.nickName
        })
        if (userInfo.hasOwnProperty('phoneNumber')){
          this.setData({
            phoneNumber:userInfo.phoneNumber
          })
        }
        if (userInfo.hasOwnProperty('detailAddress')){
          this.setData({
            detailAddress:userInfo.detailAddress
          })
        }
        if (userInfo.gender === 0){
          this.setData({
            gender:2,
            checked:false
          })
        }else {
          if (userInfo.gender===1){
            this.setData({
              gender:1,
              checked:true,
            })
          }else if (userInfo.gender===2) {
            this.setData({
              gender:2,
              checked: false,
            })
          }
        }
        if (userInfo.province!=="" && userInfo.city!=="" && userInfo.hasOwnProperty('district')){
          this.setData({
            region:[userInfo.province,userInfo.city,userInfo.district]
          })
        }
      }
    }catch (e) {
      console.log(e)
    }
  },

  //修改用户信息
  handleEdit(){
    let _id = wx.getStorageSync('userInfo')._id
    if (this.data.nickName&&this.data.gender&&this.data.region){
      if (utils.checkPhoneNumber(this.data.phoneNumber)){
        wx.showLoading({
          title:'提交中...'
        })
        user.doc(_id).update({
          data: {
            nickName:this.data.nickName,
            gender:parseInt(this.data.gender),
            phoneNumber:this.data.phoneNumber,
            province:this.data.region[0],
            city:this.data.region[1],
            district:this.data.region[2],
          },
          success:res => {
            if (res.errMsg === 'document.update:ok') {
              user.doc(_id).get({
                success: res => {
                  console.log('提交编辑成功后根据用户id查询编辑后的用户信息',res)
                  try {
                    wx.setStorageSync('userInfo', res.data)
                    wx.navigateBack({
                      success:result => {
                        wx.hideLoading();
                        wx.showToast({
                          title:'编辑成功'
                        })
                      }
                    })
                  } catch (e) { console.log(e) }
                }
              })
            }
          }
        })
      }else{
        wx.showToast({title:'联系方式不正确！',icon:"error"})
      }
    }else{
      wx.showToast({title:'请将数据填写完整！',icon:"error"})
    }
  }
})