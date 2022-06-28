const db = wx.cloud.database()
const _ = db.command
let fileId_img = null
let fileId_file = null
let _id = null
Page({
    data: {
        title:null,
        introduction:null,
        type:null,
        img:null,
        file: null,
        picker: ['文化特色', '乡镇活动', '乡镇快报'],
    },
    onLoad: function (options) {
        let info = JSON.parse(options.info)
        console.log(info)
        this.setData({
            title:info.title,
            introduction:info.introduction,
            type:info.type ,
            img: info.coverId,
            'file.name':info.filename,
            'file.fileId':info.fileId
        })
        this._id = info._id
        this.fileId_img = info.coverId
        this.fileId_file = info.fileId
    },

    //监听输入框变化
    onChange(e){},

    //监听单选框变化
    handleRadio(e){
        console.log(e)
        this.setData({
            type:e.detail.value
        })
    },

    //选择图片
    chooseImage() {
        wx.chooseImage({
            count: 1, //默认9
            sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album'], //从相册选择
            success: (res) => {
                console.log(res)
                this.setData({
                    img: res.tempFiles[0].path
                })
                wx.showLoading({
                    title:'添加中...'
                })
                let loadName = 'activity/cover/img_'+Date.now()+'.jpg'
                this.uploadCloudFile(loadName,this.data.img,res=>{
                    console.log('这是回调函数',res)
                    wx.hideLoading()
                    this.fileId_img  = res.fileID
                })
            }
        });
    },

    //浏览图片
    viewImage(e) {
        wx.previewImage({
            urls: [this.data.img],
            current: this.data.img
        });
    },

    //删除图片
    DelImg(e) {
        wx.showModal({
            title: '提示',
            content: '你确定要取消添加此图片吗？',
            success: res => {
                if (res.confirm) {
                    this.deleteCloudFile(this.fileId_img,res =>{
                        console.log('图片删除成功',res)
                        this.setData({
                            img:null
                        })
                    })
                }
            }
        })
    },

    //选择文件
    chooseFile(e){
        wx.chooseMessageFile({
            count:1,
            type:"all",
            success:result => {
                wx.showLoading({
                    title:'添加中...'
                })
                console.log(result)
                this.setData({
                    file:result.tempFiles[0]
                })
                let loadName = 'activity/md/md_' + Date.now()+'.md'
                this.uploadCloudFile(loadName,result.tempFiles[0].path,res=>{
                    console.log('添加文件成功',res)
                    wx.hideLoading()
                    this.fileId_file = res.fileID
                })
            },
            fail:res => {
                console.log(res)
                wx.showToast({
                    title:'添加失败！',
                    icon:'error'
                })
            }
        })
    },

    //删除文件
    deleteFile(e){
        wx.showModal({
            title:'提示',
            content:'你确定要取消添加此文件吗？',
            success:result => {
                if (result.confirm){
                    this.setData({
                        file:null
                    })
                }
            }
        })
    },

    //发布
    release(){
        let user_id = wx.getStorageSync('userInfo')._id
        if (!this.data.title){
            wx.showToast({
                title:'标题不能为空',
                icon:"none"
            })
        }else if (!this.data.introduction){
            wx.showToast({
                title:'简介不能为空',
                icon:"none"
            })
        }else if (!this.data.type){
            wx.showToast({
                title:'请选择一种类型',
                icon:"none"
            })
        }else if (!this.fileId_img){
            wx.showToast({
                title:'请上传封面',
                icon:"none"
            })
        }else if (!this.fileId_file){
            wx.showToast({
                title:'请上传md文件',
                icon:"none"
            })
        }else{
            wx.showLoading({
                title:'提交修改中...'
            })
            db.collection('activity').doc(this._id).update({
                data: {
                    user_id:user_id,
                    title:this.data.title,
                    introduction:this.data.introduction,
                    type:this.data.type,
                    coverId:this.fileId_img,
                    fileId: this.fileId_file,
                    filename: this.data.file.name,
                    create_time: new Date()
                },
                success: res => {
                    this.fileId_img = null
                    this.fileId_file = null
                    wx.hideLoading()
                    console.log(res)
                    wx.navigateBack({
                        success:res1 => {
                            wx.showToast({
                                title:'修改成功！'
                            })
                        }
                    })
                },
                fail:res => console.log(res)
            })
        }
    },

    /**
     * @param loadName 云存储路径
     * @param filePath 小程序临时文件路径
     * @param callback 执行成功后的回调函数
     */
    uploadCloudFile(loadName,filePath,callback){
        wx.cloud.uploadFile({
            cloudPath: loadName, // 上传至云端的路径
            filePath: filePath, // 小程序临时文件路径
            success: res => {
                callback(res)
            },
            fail: console.error
        })
    },

    /**
     * 删除云存储中的文件。
     * @param fileId 云存储id
     * @param callback 执行成功的回调函数
     */
    deleteCloudFile(fileId,callback){
        wx.cloud.deleteFile({
            fileList: [fileId],
            success: res => {
                callback(res)
            },
            fail: console.error
        })
    },
});