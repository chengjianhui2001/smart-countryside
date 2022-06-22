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
    nickName:null,
    gender:null,
    checked:null,
    phoneNumber:null,
    province:null,
    city:null,
    district:null,
    detailAddress:null,
    region: ['北京市', '北京市', '东城区'],
  },

  /**
   * 性别选择器*/
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

  /**
   * 地址选择器
   * */
  RegionChange: function(e) {
    this.setData({
      region: e.detail.value
    })
  },


  /**
   * 修改用户信息*/
  handleEdit(){
    user.doc(app.globalData.userInfo._id).update({
      data: {
        nickName:this.data.nickName,
        gender:parseInt(this.data.gender),
        phoneNumber:this.data.phoneNumber,
        province:this.data.region[0],
        city:this.data.region[1],
        district:this.data.region[2],
        detailAddress:this.data.detailAddress,
      },
      success:res => {
        wx.showLoading({
          title:'提交中...'
        })
        if (res.errMsg === 'document.update:ok') {
          app.globalData.userInfo.nickName =this.data.nickName
          app.globalData.userInfo.gender = parseInt(this.data.gender)
          app.globalData.userInfo.phoneNumber = this.data.phoneNumber
          app.globalData.userInfo.province = this.data.region[0]
          app.globalData.userInfo.city = this.data.region[1]
          app.globalData.userInfo.district = this.data.region[2]
          app.globalData.userInfo.detailAddress = this.data.detailAddress
          wx.navigateBack({
            success:result => {
              wx.hideLoading();
            }
          })
        }
      }
    })
  },

  /**
   * input框输入监听*/
  printInput:function (e){},

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad() {
    this.setData({
      nickName:app.globalData.userInfo.nickName,
      phoneNumber:app.globalData.userInfo.phoneNumber,
      detailAddress:app.globalData.userInfo.detailAddress
    })
    if (app.globalData.userInfo.province !=='' && app.globalData.userInfo.city !=='' && app.globalData.userInfo.district !==''){
      this.setData({
        region:[app.globalData.userInfo.province,app.globalData.userInfo.city,app.globalData.userInfo.district]
      })
    }

    if (app.globalData.userInfo.gender === 0){
      this.setData({
        gender:2,
        checked:false
      })
    }else {
      if (app.globalData.userInfo.gender===1){
        this.setData({
          gender:1,
          checked:true,
        })
      }else if (app.globalData.userInfo.gender===2) {
        this.setData({
          gender:2,
          checked: false,
        })
      }
    }
  },

})