const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.customerServiceMessage.setTyping({
      touser: event.openid,
      command: event.command
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}