const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection('bills').doc(event.code).set({
      data: event.data
    })
  } catch (e) {
    console.error(e)
  }
}