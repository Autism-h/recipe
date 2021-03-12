import {
  add,
  get,
  getId,
  inc,
  remove
} from '../../util/db'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: [],
    tag: false
  },
  async onLoad(e) {
    wx.showLoading({
      title: '正在加载',
    })
    let id = e.id
    //判断用户是否关注
    let openid = wx.getStorageSync('openid')
    let res = await get({
      _collection: 'likes',
      _where: {
        _openid: openid,
        menuid: id
      }
    }).catch(err => console.error(err))
    if (res.data.length > 0) {
      this.setData({
        tag: true
      })
    } else {
      this.setData({
        tag: false
      })
    }
    //关注量
    await inc({
      collection: 'menu',
      id,
      count: 1
    }).catch(err => console.error(err))
    //详情页渲染
    let result = await getId({
      collection: 'menu',
      id
    }).catch(err => console.error(err))
    this.setData({
      detail: result.data
    })
    //渲染标题
    wx.setNavigationBarTitle({
      title: this.data.detail.name
    })
    wx.hideLoading()
  },
  //预览图片
  preview(e) {
    let {
      url
    } = e.currentTarget.dataset
    wx.previewImage({
      urls: this.data.detail.images,
      current: url
    })
  },
  //点击关注
  async addLike() {
    wx.showToast({
      title: '关注成功',
    })
    let menuid = this.data.detail._id
    await add({
      collection: 'likes',
      data: {
        menuid
      }
    }).catch(err => console.error(err))
    this.setData({
      tag: true
    })
  },
  //取消关注
  async cancelLike() {
    wx.showToast({
      title: '已取消'
    })
    let menuid = this.data.detail._id
    let openid = wx.getStorageSync('openid')
    await remove({
      collection: 'likes',
      where: {
        _openid: openid,
        menuid
      }
    }).catch(err => console.error(err))
    this.setData({
      tag:false
    })
  }
})