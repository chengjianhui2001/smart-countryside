const db = wx.cloud.database()
const moment = db.collection('moment')

Page({
    //页面的初始数据
    data: {
        content:null,
        imgList: [],
        fileIds:[],
        isPost:false
    },
    //监测input
    handleTitleInput(e){},
    handledContentInput(e){},
    //检测复选框
    checkboxChange(e){
        this.setData({
            tags:e.detail.value
        })
    },
    //选择图片
    chooseImage(){
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
                            title:'添加中...'
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
                            title:'添加中...'
                        })
                        let fileName=Date.now()+Math.floor(Math.random()*100000);
                        this.handleUpload(fileName,item,index)
                    })
                }
            }
        });
    },
    //浏览图片
    viewImage:function (e) {
        wx.previewImage({
            urls: this.data.imgList,
            current: e.currentTarget.dataset.url
        });
    },
    //删除图片
    delImg:function (e) {
        wx.showModal({
            title: '您正在删除图片...',
            content: '确定要删除该图片吗？',
            cancelText: '再想想',
            confirmText: '删除',
            success: res => {
                if (res.confirm) {
                    wx.cloud.deleteFile(
                        {
                            fileList:[this.data.fileIds[e.currentTarget.dataset.index]],
                            success:res=>{
                                console.log("主动清除",res)
                            },
                            fail(){
                                console.log("删除失败")
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
        let _id = wx.getStorageSync('userInfo')._id
        if (this.data.content&&this.data.fileIds.length!==0){
            wx.showLoading({
                title:'发布中...',
            })
            moment.add({
                data: {
                    user_id:_id,
                    content: this.data.content,
                    fileIds: this.data.fileIds,
                    create_time:new Date(),
                },
                success: res => {
                    this.setData({
                        isPost:true
                    })
                    wx.hideLoading({
                        success:res1 => {
                            console.log(res)
                            wx.navigateBack({
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
        }else {
            wx.showToast({
                title:'请将内容填写完整后发布',
                icon:"none",
                duration:1000
            })
        }
    },
    //离开页面
    onUnload:function (){
        if (this.data.isPost){
            console.log("数据提交成功")
        }else {
            wx.cloud.deleteFile(
                {
                    fileList:this.data.fileIds,
                    success:res => {
                        console.log('刷新清除',res)
                    },
                    fail:res=>{
                        console.log('清除失败',res)
                    },
                }
            )
        }
    },
    //点击右下角
    doneConfirm(e){
        this.handlePost()
    },

})