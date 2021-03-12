const {
  get,
  query
} = require("../../util/db")

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false, //是否登录。 false 未登录  true，已经登录
    userInfo: null,
    active: 0,
    menuList: [], //菜单列表
    typeList: [], //分类列表
    likesList: [] //关注列表
  },
  onLoad() {
    this.getUser() //获取头像
    this.getMneu() //菜单列表
    this.getLikes() //获取关注
  },
  //获取关注列表
  async getLikes() {
    //获取openid
    let openid = wx.getStorageSync('openid')
    //根据openid查询
    let result = await get({
      _collection: 'likes',
      _where: {
        _openid: openid
      }
    }).catch(err => console.error(err))
    //把对象转换数组
    let arr = result.data.map(item => {
      return item.menuid
    })
    //根据字符串数组，查询menu集合
    let res = await query({
      collection: 'menu',
      inArr: arr
    }).catch(err => console.error(err))
    //关注量
    this.getStar(res)
    this.setData({
      likesList: res.data
    })
  },
  //登录
  login(e) {
    let {
      userInfo
    } = e.detail
    if (userInfo) {
      this.setData({
        userInfo,
        isLogin: true
      })
      wx.showToast({
        title: '登录成功'
      })
    } else {
      this.setData({
        isLogin: false
      })
    }
  },
  //获取头像
  getUser() {
    let {
      userInfo
    } = app.globalData
    if (userInfo == null) {
      app.MyInfo = res => {
        this.setData({
          userInfo: res.userInfo,
          isLogin: true
        })
      }
    } else {
      this.setData({
        userInfo: userInfo,
        isLogin: true
      })
    }
  },
  //menu切换
  menu(e) {
    let {
      id
    } = e.currentTarget
    this.setData({
      active: id
    })
    this.getType()
  },
  //跳转菜单发布
  toAdd() {
    wx.navigateTo({
      url: '/pages/pbrecipe/pbrecipe'
    })
  },
  //跳转菜单分类
  toList(e) {
    wx.showLoading({
      title: '正在加载'
    })
    let {
      id
    } = e.currentTarget
    wx.navigateTo({
      url: '/pages/list/list?id=' + id
    })
    wx.hideLoading()
  },
  //跳转详情页
  todetail(e) {
    wx.showLoading({
      title: '正在加载'
    })
    let id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id
    })
    wx.hideLoading()
  },
  //触底获取更多数据
  onReachBottom() {
    if (!this.data.isMore) return
    this.data.pages++
    this.getMneu()
  },
  //获取菜单列表
  async getMneu() {
    wx.showLoading({
      title: '正在加载'
    })
    let openid = wx.getStorageSync('openid')
    let result = await get({
      _collection: 'menu',
      _where: {
        _openid: openid
      }
    }).catch(err => console.error(err))
    this.setData({
      menuList: result.data
    })
    wx.hideLoading()
  },
  //获取分类数据
  async getType() {
    let result = await get({
      _collection: 'type'
    }).catch(err => console.error(err))
    this.setData({
      typeList: result.data
    })
  },
  //跳转菜单分类管理
  toCategory(){
    wx.navigateTo({
      url: '/pages/category/category',
    })
  },
  //判断关注量
  getStar(result) {
    result.data.forEach(item => {
      if (item.views == 0) {
        item.star = 0
      } else if (item.views > 0 && item.views <= 10) {
        item.star = 1
      } else if (item.views > 10 && item.views <= 20) {
        item.star = 2
      } else if (item.views > 20 && item.views <= 30) {
        item.star = 3
      } else if (item.views > 30 && item.views <= 40) {
        item.star = 4
      } else {
        item.star = 5
      }
    })
  }
})