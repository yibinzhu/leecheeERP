const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  // 先取出集合记录总数
  const countResult = await db.collection(event.dbName).where(_.or(event.buyers).and(event.type)).count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / event.pageSize)

  if ((event.pageIndex * event.pageSize) < total) {
    try {
      return await db.collection(event.dbName).where(_.or(event.buyers).and(event.type)).limit(event.pageSize).skip(event.pageIndex * event.pageSize).orderBy('time', 'desc').get()
    } catch (e) {
      console.error(e)
    }
  } else {
    return null
  }

} 