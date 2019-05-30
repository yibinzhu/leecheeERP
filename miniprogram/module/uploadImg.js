var myDate = new Date();
//多张图片上传
function uploadImg(data) {
  var that = this,
    i = data.i ? data.i : 0,//当前上传的哪张图片
    success = data.success ? data.success : 0,//上传成功的个数
    fail = data.fail ? data.fail : 0;//上传失败的个数

  var fileName = (myDate.getTime()).toString();//图片名称

  const filePath = data.path[i]

  // 上传图片
  const cloudPath = data.code+'-'+i+ filePath.match(/\.[^.]+?$/)[0]
  wx.cloud.uploadFile({
    cloudPath,
    filePath,
    success: res => {
      console.log('[上传文件] 成功：', res)

      that.doUpdate('bills', data.code, res.fileID)

      app.globalData.fileID = res.fileID
      app.globalData.cloudPath = cloudPath
      app.globalData.imagePath = filePath

      success++;//图片上传成功，图片上传成功的变量+1
      console.log(resp)
      console.log(i);

    },
    fail: e => {
      console.error('[上传文件] 失败：', e)
      fail++;//图片上传失败，图片上传失败的变量+1
      console.log('fail:' + i + "fail:" + fail);
      wx.showToast({
        icon: 'none',
        title: '上传失败',
      })
    },
    complete: () => {
      wx.hideLoading()
      console.log(i);
      i++;//这个图片执行完上传后，开始上传下一张
      if (i == data.path.length) {   //当图片传完时，停止调用          
        console.log('执行完毕');
        console.log('成功：' + success + " 失败：" + fail);

      } else {//若图片还没有传完，则继续调用函数
        console.log(i);
        data.i = i;
        data.success = success;
        data.fail = fail;
        that.uploadimg(data);
      }
    }
  })

}

function doUpdate(col,code,imgPath){
  const db = wx.cloud.database()
  exports.main = async (event, context) => {
    try {
      return await db.collection(col).doc(code).update({
        // data 传入需要局部更新的数据
        data: {
          images: images.push(imgPath)
        }
      })
    } catch (e) {
      console.error(e)
    }
  }
}

module.exports.uploadimg = uploadImg;