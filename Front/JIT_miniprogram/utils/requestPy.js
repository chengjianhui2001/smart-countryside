//加载：var call = require("../util/requestPy.js")

let app = getApp();

let host = "http://127.0.0.1:5000";   //开发地址
let projectName = "";
let uploadHost = "http://127.0.0.1:5000";


/**
 * GET请求
 * doSuccess：请求成功-回调函数
 */
function getData(url,doSuccess){
  wx.request({
    url: host+projectName+url,
    method: 'GET',
    header: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    success: function(res) {
      sucClass(res.data, doSuccess);
    },
    fail: function(res) {
      console.log('Ajax请求错误！');
      console.log(res);
      // noticeError(this, 'Ajax请求错误！', data);
      errorClass(res);
    }
  })
}


/**
 * POST请求
 * url: 请求路径
 * postData: 提交的参数，JSON类型
 * doSuccess：请求成功-回调函数
 */
function postData(url,postData,doSuccess){
  wx.request({
    url: host+projectName+url,
    data: postData,
    method: 'POST',
    header: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    success: function (res) {
      sucClass(res.data, doSuccess);
    },
    fail: function (res) {
      console.log('Ajax请求错误！');
      console.log(host+url);
      console.log(res);
      // noticeError(this, 'Ajax请求错误！', data);
      errorClass(res);
    }
  })
}
/**
 * POST请求
 * url: 请求路径
 * postData: 提交的参数，JSON类型
 * doSuccess：请求成功-回调函数
 * param: 传入回调函数的参数
 */
function postDataParam(url, postData, doSuccess, param) {
  wx.request({
    url: host+projectName + url,
    data: postData,
    method: 'POST',
    header: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    success: function (res) {
      doSuccess(res.data,param);
    },
    fail: function (res) {
      console.log('Ajax请求错误！');
      console.log(host + url);
      console.log(res);
      // noticeError(this, 'Ajax请求错误！', data);
      errorClass(res);
    }
  })
}

/**
 * POST请求
 * url: 请求路径
 * postData: 提交的参数，JSON类型
 * doSuccess：请求成功-回调函数
 * param: 传入回调函数的参数
 */
function postDataParam2(url, postData, doSuccess, param1,param2) {
  wx.request({
    url: host+projectName + url,
    data: postData,
    method: 'POST',
    header: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    success: function (res) {
      doSuccess(res.data,param1,param2);
    },
    fail: function (res) {
      console.log('Ajax请求错误！');
      console.log(host + url);
      console.log(res);
      // noticeError(this, 'Ajax请求错误！', data);
      errorClass(res);
    }
  })
}



/**
 * 请求成功的回调函数
 */
function sucClass(data, funcSuc) {
  // console.log(data);
  if (data.code === 500) {
    console.log('系统后台错误！');
    //noticeError('系统后台错误！', data.msg);
    // errorClass(data.code);
    return;
  }
  //调用成功
  funcSuc(data);
}
function errorClass(code) {
  wx.showLoading({
    title: '请检查网络连接',
  })
  switch (code) {
    case 403:
      // parent.location.href = "error/403.html";
      break;
    case 404:
      // parent.location.href = "/error/404.html";
      break;
    case 500:
      // parent.location.href = "/error/500.html";
      break;
    default:
      break;
  }
}


module.exports = {
  getData: getData,
  postData: postData,
  postDataParam: postDataParam,
  postDataParam2: postDataParam2,
  uploadHost: uploadHost,
  host: host
}

