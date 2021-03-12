//封装上传单个图片临时地址
function upload(tamePath) {
  let time = new Date().getTime()
  let ext = tamePath.split('.').pop()
  return new Promise((resolve, reject) => {
    wx.cloud.uploadFile({
      cloudPath: time + '.' + ext,
      filePath: tamePath,
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      }
    })
  })
}

//封装上传多个图片临时地址
async function multipleUpload(arr){
  wx.showLoading({
    title: '正在提交',
    mask: true
  })
  //批量上传图片
  let filesArr = []
  arr.forEach(item=>{
    let result = upload(item.url)
    filesArr.push(result)
  })
  //所有图片都上传完，返回云端地址
  let img = await Promise.all(filesArr)
  //返回所有图片数组
  let imgArr = img.map(item=>{
    return item.fileID
  })
  wx.hideLoading()
    wx.showToast({
      title: '提交成功'
    })
  return imgArr
}

export {
  upload,
  multipleUpload
}