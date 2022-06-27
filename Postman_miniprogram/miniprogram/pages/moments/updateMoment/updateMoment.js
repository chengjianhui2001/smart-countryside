const db = wx.cloud.database()
const moment = db.collection('moment')

Page({
    //页面的初始数据
    data: {
        _id:null,
        moment:null,
        content:null,
        imgList: [],
        fileIds:[],
    },
    //初始化页面
    onLoad(e){
      let moment = JSON.parse(e.moment)
        this.setData({
            moment:moment,
            content:moment.content,
            fileIds:moment.fileIds,
            _id:moment._id
        },res=>{
            wx.cloud.getTempFileURL({
                fileList: this.data.fileIds,
                success:res1 => {
                    console.log(res1)
                    let list = res1.fileList
                    for (let index in list){
                        this.setData({
                            [`imgList[${index}]`]:list[index].tempFileURL
                        })
                    }
                }
            })
        })
    },
    handledContentInput(e){},
    //选择图片
    ChooseImage(){
        wx.chooseImage({
            count: 9, //默认9
            sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], //从相册选择拍照
            success: (res) => {
                if (this.data.imgList.length !== 0) {
                    this.setData({
                        imgList: this.data.imgList.concat(res.tempFilePaths)
                    })
                    res.tempFilePaths.forEach((item,index)=>{
                        wx.showLoading({
                            title:'上传中...'
                        })
                        let fileName=Date.now()+Math.floor(Math.random()*100000);
                        this.handleUpload(fileName,item,parseInt(index+this.data.imgList.length-1))
                    })
                } else {
                    this.setData({
                        imgList: res.tempFilePaths
                    })
                    res.tempFilePaths.forEach((item,index)=>{
                        wx.showLoading({
                            title:'上传中...'
                        })
                        let fileName=Date.now()+Math.floor(Math.random()*100000);
                        this.handleUpload(fileName,item,index)
                    })
                }
            }
        });
    },
    //浏览图片
    ViewImage:function (e) {
        wx.previewImage({
            urls: this.data.imgList,
            current: e.currentTarget.dataset.url
        });
    },
    //删除图片
    DelImg:function (e) {
        wx.showModal({
            title: '您正在删除图片...',
            content: '确定要删除该图片吗？',
            cancelText: '再想想',
            confirmText: '删除',
            success: res => {
                if (res.confirm) {
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
    //上传图片
    handleUpload(fileName,filePath,index){
        wx.cloud.uploadFile({
            cloudPath:`moments/${fileName}.jpg`,
            filePath:filePath,
        }).then(res=>{
            console.log('上传成功',res)
            this.setData({
                [`fileIds[${index}]`]:res.fileID
            },res=>{
                wx.hideLoading()
            })
        }).catch(err=>{
            console.log(err)
        })
    },
    //发起请求
    handlePost(){
        let user_id = wx.getStorageSync('userInfo')._id
        if (this.data.content&&this.data.fileIds.length!==0){
            wx.showLoading({
                title:'发送中...',
            })
            moment.doc(this.data._id).update({
                data: {
                    user_id:user_id,
                    content: this.data.content,
                    fileIds: this.data.fileIds,
                    create_time:new Date(),
                },
                success: res => {
                    wx.hideLoading({
                        success:res1 => {
                            console.log(res)
                            wx.navigateBack({
                                success:res2 => {
                                    wx.showToast({
                                        title:'发送成功',
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
        }else {
            wx.showToast({
                title:'请将内容填写完整后发布',
                icon:"none",
                duration:1000
            })
        }
    },
    //点击右下角
    doneConfirm(e){
        this.handlePost()
    },

})