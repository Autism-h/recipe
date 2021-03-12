import {
  get,
  search
} from '../../util/db'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },
  async onLoad(e) {
    let id = e.id
    let keyword = e.keyword
    if(id != undefined){
      //根据分类id查询menu集合
      this.getTypeId(id)
    }else{
      //根据关键字搜索
      let result = await search({collection:'menu',keyword}).catch(err=>console.error(err))
      this.setData({
        list:result.data
      })
    }
  },
  //根据分类id查询menu集合
  async getTypeId(typeid) {
    wx.showLoading({
      title: '正在加载',
    })
    let result = await get({
      _collection: 'menu',
      _where: {
        typeid
      }
    }).catch(err => console.error(err))
    this.getStar(result)//关注量
    this.setData({
      list: result.data
    })
    wx.hideLoading()
  },
  //跳转详情页
  todetail(e){
    let {id} = e.currentTarget
    wx.navigateTo({
      url: '/pages/detail/detail?id='+id
    })
  },
  //判断关注量
  getStar(result){
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