import {
  get
} from '../../util/db'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    keyword: '', //关键字
    hot: [],
    history: []
  },
  async onLoad() {
    wx.showLoading({
      title: '正在加载',
    })
    let result = await get({
      _collection: 'menu',
      _limit: 9,
      _orderBy: {
        field: 'views',
        sort: 'desc'
      },
      _field:{
        _id:true,
        name:true
      }
    }).catch(err => console.error(err))
    this.setData({
      hot: result.data
    })
    wx.hideLoading()
  },
  onShow(){
    //近期搜索缓存渲染
    let arr = wx.getStorageSync('recent')
    this.setData({
      history:arr
    })
  },
  //根据搜索跳转分类列表
  async toList() {
    wx.showLoading({
      title: '正在加载',
    })
    //近期搜索
    let keyword = this.data.keyword
    let arr = wx.getStorageSync('recent') || []
    let index = arr.findIndex(item=>{
      return item == keyword
    })
    //关键字是否存在
    if(index != -1){
      arr.splice(index,1)
    }
    //关键字存入数组
    arr.unshift(keyword)
    //存入缓存
    wx.setStorageSync('recent', arr)
    wx.navigateTo({
      url: '/pages/list/list?keyword=' + this.data.keyword
    })
    this.setData({
      keyword: ''
    })
    wx.hideLoading()
  },
  //点击热搜跳转详情
  tohotList(e) {
    wx.showLoading({
      title: '正在加载',
    })
    //跳转详情页
    let {
      id
    } = e.currentTarget
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id
    })
    wx.hideLoading()
  }
})