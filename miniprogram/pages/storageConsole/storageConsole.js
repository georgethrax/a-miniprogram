// pages/storageConsole/storageConsole.js

const app = getApp()

Page({

  data: {
    fileID: '',
    cloudPath: '',
    imagePath: '',
    tempFileURL: '',
    url_rsp: '',
  },

  returnHomePage: function(){
    wx.redirectTo({
      url: '../index/index',
    })
  },

  previewImage:function(path){
    var that = this;
    console.log('that', that)
    console.log('previewImage.path', path)
    wx.previewImage({
      current: path,//当前显示图片的http链接 
      urls: [path], //要预览的图片
    })
    wx.getImageInfo({
      src: path,
      success(res){
        console.log(res)
        console.log(res.width)
        console.log(res.height)
      }
    })
  },

  previewImage1:function(e){
    console.log('previewImage1')
    this.previewImage(this.data.tempFileURL)
  },
  previewImage2:function(e){
    console.log('previewImage2')
    this.previewImage(this.data.url_rsp)
  },

  onLoad: function (options) {

    const {
      fileID,
      cloudPath,
      imagePath,
      tempFileURL,
      url_rsp,
    } = app.globalData

    this.setData({
      url_rsp: ''
    })

    wx.showLoading({
      title: 'AI渲染中',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
    

    
    wx.cloud.getTempFileURL({
      fileList: [app.globalData.fileID],
      success: res => {
        console.log('[getTempFileURL] 成功：', res)
        // fileList 是一个有如下结构的对象数组
        // [{
        //    fileID: 'cloud://xxx.png', // 文件 ID
        //    tempFileURL: '', // 临时文件网络链接
        //    maxAge: 120 * 60 * 1000, // 有效期
        // }]
        // tempFileURL = res.fileList[0].tempFileURL;
        // app.globalData.tempFileURL = tempFileURL;
        console.log('getTempFileURL res.fileList', res.fileList)
        console.log('app.globalData', app.globalData)
        console.log('getTempFileURL res.fileList[0]', res.fileList[0])
        console.log('getTempFileURL res.fileList[0].tempFileURL', res.fileList[0].tempFileURL)
        const tempFileURL = res.fileList[0].tempFileURL;
        console.log('tempFileURL', tempFileURL)
        
        this.setData({
          fileID,
          cloudPath,
          imagePath,
          tempFileURL,          
        })

        wx.cloud.callFunction({
          name: 'sum',
          data: {
            url_req: this.data.tempFileURL,
          },
          success: res => {
            console.log("callFunction success, res:", res)
            console.log("stringify:", JSON.stringify(res.result.page.data.ResultUrl))
            wx.hideLoading()
            wx.showToast({
              title: 'AI渲染成功',
            })
            this.setData({
              url_rsp: res.result.page.data.ResultUrl
            })
            console.log('globalData', app.globalData)
            console.log('data', this.data)
          },
          fail: err => {
            wx.hideLoading()
            wx.showToast({
              icon: 'none',
              title: '调用失败',
            })
            console.error('[云函数] [sum] 调用失败：', err)
          }
        })
        
      },
      fail: e => {
        console.error('[getTempFileURL] 失败：', e)
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: 'getTempFileURL失败',
        })
      },
    })

    

    // this.setData({
    //   fileID,
    //   cloudPath,
    //   imagePath,
    //   tempFileURL,
    // })

    console.group('文件存储文档')
    console.log('https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/storage.html')
    console.groupEnd()
    console.log('globalData', app.globalData, 'this', this.data.tempFileURL, this.data.fileID, this.data.imagePath, this.data.cloudPath, this.data.url_rsp)

  },

})
