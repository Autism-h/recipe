import {
  add,
  get
} from '../../util/db'
import {
  upload,
  multipleUpload
} from '../../util/upload'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList: [],
    files: [],
    name: '',
    info: ''
  },
  async onLoad() {
    //获取菜单分类
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    let result = await get({
      _collection: 'type'
    }).catch(err => {
      console.error(err)
    })
    this.setData({
      typeList: result.data
    })
    wx.hideLoading()
  },
  //获取相册图片地址
  selectimg(e) {
    let arr = e.detail.tempFilePaths
    let files = arr.map(item => {
      return {
        url: item
      }
    })
    this.setData({
      files
    })
  },
  //删除图片地址
  del(e){
    let files = e.detail.item.url = []
    this.setData({
      files
    })
  },
  //提交表单
  async release(e) {
    if (e.detail.value.name == '') {
      wx.showToast({
        title: '名称不能为空',
        icon: 'error'
      })
      return
    }
    if (this.data.files == '') {
      wx.showToast({
        title: '最少添加一张图',
        icon: 'error'
      })
      return
    } else {
      //批量上传图片
      let arr = this.data.files //图片临时地址集合
      //所有图片上传
      let images = await multipleUpload(arr).catch(err => console.error(err))
      let {
        typeid,
        name,
        info
      } = e.detail.value
      let {
        avatarUrl,
        nickName
      } = app.globalData.userInfo
      let views = 0
      let likes = 0
      let addtime = new Date().getTime()
      //添加
      let result = await add({
        collection: 'menu',
        data: {
          typeid,
          name,
          info,
          avatarUrl,
          nickName,
          views,
          likes,
          images,
          addtime
        }
      }).catch(err => {
        console.log(err);
      })
      //提交成功后初始化
      this.setData({
        files: [],
        name: '',
        info: ''
      })
      console.log(result);
    }
  }
})