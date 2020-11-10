const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {

  var myDate = new Date()
  var _date = myDate.toLocaleDateString()
  let _timestamp = new Date(_date).getTime()

  let _all = await db.collection(event.dbName).where(_.or(event.buyers)).count()
  let _done = await db.collection(event.dbName).where(_.or(event.buyers).and({ type: "1" })).count()
  let _undone = await db.collection(event.dbName).where(_.or(event.buyers).and({ type: "0" })).count()
  let _today = await db.collection(event.dbName).where(_.or(event.buyers).and({ timestamp: _.gte(_timestamp)})).count()
  let stats = {}
  stats.all = _all
  stats.done = _done
  stats.undone = _undone
  stats.today = _today
  return stats
}