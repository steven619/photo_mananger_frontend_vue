var checkIp = (rule:any, value:string, callback:any) => {
  if (!/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value)) {
    callback(new Error('请输入正确的IP地址'))
  } else {
    callback()
  }
}
var checkPort = (rule:any, value:Number, callback:any) => {
  // if ((value || '') === '') {
  //   callback(new Error('请输入端口号'))
  // } else if (!/^\d{1,5}$/.test(value)) {
  //   callback(new Error('端口格式不正确'))
  // } else
  if (value < 1 || value > 65535) {
    callback(new Error('端口范围不正确'))
  } else {
    callback()
  }
}
var checkUsername = (rule:any, value:string, callback:any) => {
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(value)) {
    callback(new Error('必须为数字和英文字母的组合'))
  } else {
    callback()
  }
}
var checkMask = (rule:any, value:Number, callback:any) => {
  // if ((value || '') === '') {
  //   callback(new Error('掩码为1-32的数字'))
  // } else if (!/^\d{1,5}$/.test(value)) {
  //   callback(new Error('掩码不正确'))
  // } else
  if (value < 1 || value > 32) {
    callback(new Error('掩码范围不正确'))
  } else {
    callback()
  }
}

var checkPass = (rule:any, value:string, callback:any) => {
  if ((value || '') === '') {
    callback(new Error('请输入密码'))
  } else {
    callback()
  }
}

export { checkIp, checkPort, checkMask, checkPass, checkUsername }
