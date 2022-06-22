// pages/addNews/addNews.js
const app = getApp()
const db = wx.cloud.database()
const news = db.collection('news')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id:null,
        title:null,
        content:null,
        tags:[],
        items: [
            {value: '时事热点', name: '时事热点',checked: ''},
            {value: '饮食文化', name: '饮食文化',checked: ''},
            {value: '生活文化', name: '生活文化',checked: ''},
            {value: '生活常识', name: '生活常识',checked: ''},
            {value: '国际形势', name: '国际形势',checked: ''},
            {value: '乡镇发展', name: '乡镇发展',checked: ''}
        ],
        imgList: [],
        fileIds:[],
        isPost:false
    },

    //初始函数
    onLoad:function(option) {
        this.setData({
            id:option.id
        },res=>{
            this.getData()
        })
    },

    getData(){
        news.doc(this.data.id).get({
            success:res=>{
                console.log(res)
                this.setData({
                    title:res.data.title,
                    content:res.data.content,
                    tags:res.data.tags,
                    imgList: res.data.fileIds,
                    fileIds:res.data.fileIds,
                },res=>{
                    this.data.items.forEach((i,index)=>{
                        if (this.data.tags.includes(i.value)){
                            this.setData({
                                [`items[${index}].checked`]:'true'
                            })
                        }
                    })
                })
            }
        })
    },


    /**
     * 监测input
     * */
    handleTitleInput(e){},
    handledContentInput(e){},

    /**
     * 检测复选框*/
    checkboxChange(e){
        console.log(e)
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
                wx.showLoading({
                    title:'上传中...'
                })
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
                wx.hideLoading()
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
                    wx.cloud.deleteFile(
                        {
                            fileList:[this.data.fileIds[e.currentTarget.dataset.index]],
                            success(){
                                console.log("删除成功")
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

    /**
     * 上传图片*/
    handleUpload(fileName,filePath,index){
        wx.cloud.uploadFile({
            cloudPath:`newsImage/${fileName}.jpg`,
            filePath:filePath,
        }).then(res=>{
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
            title:'提交修改中...',
        })
        if (this.data.title===null||this.data.title===''||this.data.content===null||this.data.content===''||this.data.tags.length===0||this.data.fileIds.length===0){
            wx.showToast({
                title:'请将内容填写完整后提交',
                icon:"none",
                duration:1000
            })
        }else {
            setTimeout(()=>{
                news.doc(this.data.id).update({
                    data: {
                        user_id:app.globalData.userInfo._id,
                        title: this.data.title,
                        content: this.data.content,
                        tags: this.data.tags,
                        fileIds: this.data.fileIds,
                        createDate:this.TimeFormat(new Date()),
                        createTime:new Date()
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
                                            title:'修改成功',
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
    },

    /*onUnload:function (){
        if (this.data.isPost){
            console.log("数据提交成功")
        }else {
            wx.cloud.deleteFile(
                {
                    fileList:this.data.fileIds,
                    success:res => {
                        console.log('清除成功',res)
                    },
                    fail:res=>{
                        console.log('清除失败',res)
                    },
                }
            )
        }
    },*/

    TimeFormat(time){
        let date = new Date(time);
        let YY = date.getFullYear() + '-';
        let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
        let hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        let mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        let ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return YY + MM + DD + " " + hh + mm + ss;
    },

})