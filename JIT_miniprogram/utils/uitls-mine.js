/*控制台输出请求数据*/

function logDataInfo(data,url){
    console.log("提交的数据为=========================")
    console.log(data)
    console.log("提交的地址为=========================")
    console.log(url)
}

/*本地存储并加密*/
function setEncryptInfo(key,value){
    wx.setStorage({
        key: key,
        data: value,
        encrypt: true, // 若开启加密存储，setStorage 和 getStorage 需要同时声明 encrypt 的值为 true
        success() {
            console.log("存储成功并加密")
        },
    })
}

/*获取本地加密存储*/
function getEncryptInfo(key){
    return wx.getStorageSync(key)
}

/*添加存储*/
function setInfo(key,value){
    wx.setStorage({
        key: key,
        data: value,
        success() {
            console.log("存储成功并加密")
        },
    })
}

/*获取本地存储*/
function getInfo(key){
    return wx.getStorageSync(key)
}

function removeInfo(key){
    wx.removeStorage({
        key: 'key',
        success (res) {
            console.log(res)
        }
    })
}

function formatDate(time) {
    let date = new Date(time);
    let YY = date.getFullYear() + '-';
    let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    let hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    let mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    let ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return YY + MM + DD;
}

module.exports = {
    logDataInfo:logDataInfo,
    setEncryptInfo:setEncryptInfo,
    getEncryptInfo:getEncryptInfo,
    getInfo:getInfo,
    setInfo:setInfo,
    removeInfo:removeInfo,
    formatDate:formatDate
}