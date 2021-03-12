import {get, gte} from '../../util/db'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList:[]
  },
  async onLoad(){
    wx.showLoading({
      title: '正在加载',
    })
    //获取菜谱分类列表
    let result = await get({_collection:'type'}).catch(err=>console.error(err))
    this.setData({
      typeList:result.data
    })
    wx.hideLoading()
  },
  //跳转菜谱列表
  toList(e){
    let {id} = e.currentTarget
    wx.navigateTo({
      url: '/pages/list/list?id='+id,
    })

  }
})