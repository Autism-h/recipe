import {
    get
} from '../../util/db'
Page({
    data: {
        types: [{
                src: "../../imgs/index_07.jpg",
                typename: "营养菜谱"
            },
            {
                src: "../../imgs/index_09.jpg",
                typename: "儿童菜谱"
            },
        ],
        indexList: [],
        pages: 1,
        pagesSize: 4,
        isMore: true
    },
    async onLoad() {
        wx.showLoading({
            title: '正在加载',
        })
        this.getPages()
        wx.hideLoading()
    },
    //跳转详情页
    todetail(e) {
        let id = e.currentTarget.id
        wx.navigateTo({
            url: '/pages/detail/detail?id=' + id
        })
    },
    //触底获取更多数据
    onReachBottom() {
        if (!this.data.isMore) return
        this.data.pages++
        this.getPages()
    },
    //封装查询数据库
    async getPages() {
        wx.showLoading({
            title: '正在加载'
        })
        let _skip = (this.data.pages - 1) * this.data.pagesSize
        let result = await get({
            _collection: 'menu',
            _skip,
            _limit: this.data.pagesSize
        }).catch(err => console.error(err))
        if (result.data.length < this.data.pagesSize) {
            this.data.isMore = false
        }
        this.setData({
            indexList: this.data.indexList.concat(result.data)
        })
        wx.hideLoading()
    },
    //跳转菜谱分类
    totype(){
        wx.navigateTo({
          url: '/pages/type/type',
        })
    }
})