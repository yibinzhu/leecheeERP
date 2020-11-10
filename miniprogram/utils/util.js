const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const createOrderNumber = function (){
  //商场代码+日期
  var date = new Date();
  var year =  date.getFullYear();
  var month = date.getMonth()+1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var  second = date.getSeconds();
  let code = ''+year + month + day + hour + minute + second
  return code;
}

module.exports = {
  formatTime: formatTime,
  createOrderNumber: createOrderNumber
}
