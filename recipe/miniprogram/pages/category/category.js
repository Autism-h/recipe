import {
  get,
  add,
  update,
  remove
} from '../../util/db'
Page({
  data: {
    typeList: [], //菜单分类列表
    name: '',
    addname:'',
    addTag: false,
    uploadTag: false
  },
  async onLoad() {
    //获取菜单分类
    let result = await get({
      _collection: 'type'
    }).catch(err => console.error(err))
    this.setData({
      typeList: result.data
    })
  },
  //点击添加显示输入框
  isAdd() {
    this.setData({
      addTag: true,
      addname:''
    })
  },
  //点击显示修改输入框
  isUpload(e) {
    let {
      name,
      id
    } = e.currentTarget.dataset
    this.setData({
      uploadTag: true,
      name,
      id
    })
  },
  //添加数据记录
  async add() {
    await add({
      collection: 'type',
      data: {
        name: this.data.addname
      }
    }).catch(err => console.error(err))
    //重新读取数据
    let res = await get({
      _collection: 'type'
    }).catch(err => console.error(err))
    //渲染
    this.setData({
      typeList: res.data,
      addTag: false,
      addname: ''
    })
    wx.showToast({
      title: '添加成功',
    })
  },
  //修改数据记录
  async upload() {
    await update({
      collection: 'type',
      id: this.data.id,
      data: {
        name: this.data.name
      }
    }).catch(err => console.error(err))
    //重新读取数据
    let res = await get({
      _collection: 'type'
    }).catch(err => console.error(err))
    //渲染
    this.setData({
      uploadTag: false,
      typeList: res.data
    })
    wx.showToast({
      title: '修改成功',
    })
  },
  //删除数据记录
  remove(e) {
    wx.showModal({
      title: '温馨提示',
      content: '你确定要删除吗？',
      success: async res => {
        if (res.confirm == true) {
          let {id} = e.currentTarget
          //删除
          await remove({
            collection: 'type',
            where: {
              _id: id
            }
          }).catch(err => console.error(err))
          //重新读取数据
          let res = await get({
            _collection: 'type'
          }).catch(err => console.error(err))
          //渲染
          this.setData({
            typeList:res.data
          })
          wx.showToast({
            title: '删除成功',
          })
        }
      },
      fail: err => {
        console.log(err);
      }
    })
  }
})