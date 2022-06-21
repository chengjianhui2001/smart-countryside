// pages/addNews/addNews.js
const db = wx.cloud.database()
const news = db.collection('news')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:null,
    content:null,
    tags:null,
    items: [
      {value: 0, name: '时事热点'},
      {value: 1, name: '饮食文化'},
      {value: 2, name: '生活文化'},
      {value: 3, name: '生活常识'},
      {value: 4, name: '国际形势'},
      {value: 5, name: '乡镇发展'}
    ],
    imgList: [],
    fileIds:[]
  },

  /**
   * 监测input
   * */
  handleTitleInput(e){},
  handledContentInput(e){},

  /**
   * 检测复选框*/
  checkboxChange(e){
    this.setData({
      tags:e.detail.value
    })
  },

  /**
   * 选择图片
   * */
  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length !== 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
          res.tempFilePaths.forEach((item,index)=>{
            let fileName=Date.now()+"---"+parseInt(index+this.data.imgList.length-1);
            this.handleUpload(fileName,item,parseInt(index+this.data.imgList.length-1))
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
          res.tempFilePaths.forEach((item,index)=>{
            let fileName=Date.now()+"---"+index;
            this.handleUpload(fileName,item,index)
          })
        }
      }
    });
  },

  /**
   * 浏览图片
   * */
  ViewImage:function (e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },

  /**
   * 删除图片
   * */
  DelImg:function (e) {
    wx.showModal({
      title: '您正在删除图片...',
      content: '确定要删除该图片吗？',
      cancelText: '再想想',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          console.log(e.currentTarget.dataset.index)
          wx.cloud.deleteFile(
              {
                fileList:[this.data.fileIds[e.currentTarget.dataset.index]],
                success(){
                  wx.showToast({title: '删除成功',})
                },
                fail(){
                  wx.showToast({title: '删除失败',})
                },
              }
          );
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.data.fileIds.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList,
            fileIds: this.data.fileIds
          })
        }
      }
    })
  },

 /**
  * 上传图片*/
 handleUpload(fileName,filePath,index){
   wx.cloud.uploadFile({
     cloudPath:`newsImage/${fileName}.jpg`,
     filePath:filePath,
   }).then(res=>{
     console.log('当前对象为：',index,'值为',res.fileID)
     this.setData({
       [`fileIds[${index}]`]:res.fileID
     })
   }).catch(err=>{
     console.log(err)
   })
 },

  /**
   * 发起请求
   * */
  handlePost(){
    wx.showLoading({
      title:'发布中',
    })
    if (this.data.title===null||this.data.title===''||this.data.content===null||this.data.content===''||this.data.tags===null||this.data.fileIds===[]){
      wx.showToast({
        title:'请将内容填写完整后发布',
        icon:"none",
        duration:1000
      })
    }else {
      setTimeout(()=>{
        news.add({
          data: {
            title: this.data.title,
            content: this.data.content,
            tags: this.data.tags,
            fileIds: this.data.fileIds
          },
          success: res => {
            wx.hideLoading({
              success:res1 => {
                console.log(res)
                wx.switchTab({
                  url:'/pages/home/home',
                  success:res2 => {
                    wx.showToast({
                      title:'发布成功',
                      icon:"success"
                    })
                  }
                })
              }
            })
          },
          fail: err => {
            console.log(err)
          }
        })
      },1000)

    }
  }
})