// 基本上可以不用
function mapToObj (array) {
  var obj = {}
  for (var ele of array) {
    obj[ele.ID] = ele
  }
  return obj
}

function setCanvasContent (text) {
  // 暂时不用shader，text -> canvas -> texture -> map to sprite

  var canvas = document.createElement('canvas')
  var ctx = canvas.getContext('2d')

  // canvas 宽高一般要设置>256
  canvas.width = 256
  canvas.height = 256

  // 外框线
  ctx.fillStyle = '#700000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 内正方形
  ctx.fillStyle = 'white'
  ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20)

  // 文字
  ctx.font = `50pt Arial`
  ctx.fillStyle = '#000000'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.fillText(text, canvas.width / 2, canvas.height / 2)
  return canvas
}
// function conceptGraph(){
//
// }
function setSpriteCanvasContent (text, ratio = 0.5) {
  var width = 384
  var height = width * ratio
  var canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  var ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)
  ctx.font = 50 + 'px " bolder'
  ctx.fillStyle = '#000'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, width / 2, height / 2)

  return canvas
}

export {mapToObj, setCanvasContent, setSpriteCanvasContent}
