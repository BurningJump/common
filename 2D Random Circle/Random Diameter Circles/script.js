// 生成随机点
function randomPoint ({w, h, minR, maxR}) {
  const x = parseInt(Math.random() * w)
  const y = parseInt(Math.random() * h)
  const r = parseInt(Math.random() * (maxR - minR) + minR)
  return {x, y, r}
}

// 判断两个区域是否重叠
function testOverlay (pointA, pointB) {
  const x = Math.abs(pointA.x - pointB.x)
  const y = Math.abs(pointA.y - pointB.y)
  const distance = Math.sqrt((x * x) + (y * y))
  if (distance >= (pointA.r + pointB.r)) {
    return false
  } else {
    return true
  }
}

// 判断新生成的点是否有效
function testAvailable (pointArr, newPoint) {
  let arr = Array.from(pointArr)
  let aval = true
  while(arr.length > 0) {
    let lastPoint = arr.pop()
    if (testOverlay(lastPoint, newPoint)) {
      aval = false
      break;
    }
  }
  return aval
}

// 绘制圆形
function drawCircles (ctx, circleArr) {
  let point = circleArr.pop()
  ctx.moveTo(point.x + point.r, point.y)
  ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2, true)
  if (circleArr.length > 0) {
    drawCircles(ctx, circleArr, point.r)
  }
}

/***** 性能相关 start  *****/

// 计算运算时间
function calcTimestamp (startTime) {
  const endTime = Date.now()
  const gap = endTime - startTime
  document.getElementById('countTime').innerHTML = gap + 'ms'
  return gap
}

// 计算圆圈占地面积
function calcArea (point, size) {
  let area = point.r * point.r * Math.PI
  if (point.x >= point.r && point.y >= point.r && size.w - point.x >= point.r && size.h - point.y >= point.r) {
    return area
  } else {
    if ((point.x < point.r || size.w - point.x < point.r) && (point.y < point.r || size.h - point.y < point.r)) {
      let heX = point.x >= point.r ? size.w - point.x : point.x
      let heY = point.y >= point.r ? size.h - point.y : point.y
      let arcRatio = 1 - (Math.acos(heX / point.r) + Math.acos(heY / point.r)) / (2 * Math.PI) - 0.5
      return area * arcRatio + heX * heY + ((heX * Math.sqrt(point.r * point.r - heX * heX) + heY * Math.sqrt(point.r * point.r - heY * heY)) / 2)
    } else {
      let he
      if (point.x >= point.r && size.w - point.x >= point.r) {
        he = point.y >= point.r ? size.h - point.y : point.y
      }
      if (point.y >= point.r && size.h - point.y >= point.r) {
        he = point.x >= point.r ? size.w - point.x : point.x
      }
      let arcRatio = 1 - Math.acos(he / point.r) / Math.PI
      let triArea = he * Math.sqrt(point.r * point.r - he * he)

      return area * arcRatio + triArea
    }
  }
}

// 计算所有圆圈面积比例
function calcAreaRatio (pointArr, size) {
  let areas = 0
  pointArr.map(circle => {
    areas += calcArea(circle, size)
  })
  let per = areas / (size.w * size.h)
  document.getElementById('tiledRatio').innerHTML = (per * 100).toFixed(2) + '%'
  return per
}

// 性能数据统计
function statistics ({pointArr, size, radius, startTime}) {
  let total = pointArr.length
  drawCounter += 1
  totalCounter += total
  countTimeStatistics += calcTimestamp(startTime)
  tiledRatioStatistics += calcAreaRatio(pointArr, size, radius)
  document.getElementById('drawCounter').innerHTML = drawCounter
  document.getElementById('countTimeAverage').innerHTML = (countTimeStatistics / drawCounter).toFixed(2) + 'ms'
  document.getElementById('total').innerHTML = total
  document.getElementById('totalAverage').innerHTML = (totalCounter / drawCounter).toFixed(2)
  document.getElementById('tiledRatioAverage').innerHTML = ((tiledRatioStatistics / drawCounter) * 100).toFixed(2) + '%'
}

/***** 性能相关 end  *****/

// 开始
function startDrawing () {
  const startTime = Date.now()
  const canvas = document.getElementById('circles')
  const ctx = canvas.getContext('2d')
  const size = {w: canvas.clientWidth, h: canvas.clientHeight}
  const radius = {minR: 15, maxR: 40}
  const max = 50
  Object.assign(size, radius)
  let pointArr = []
  let count = 0
  while(count <= max) {
    let newPoint = randomPoint(size)
    if (testAvailable(pointArr, newPoint)) {
      pointArr.push(newPoint)
      count = 0
    } else {
      count += 1
    }
  }
  
  // 复制数组以计算面积
  let pointArrTemp = Array.from(pointArr)
  
  ctx.clearRect(0, 0, size.w, size.h)
  ctx.beginPath()
  drawCircles(ctx, pointArr)
  ctx.stroke()
  
  // 性能数据统计
  statistics({startTime, pointArr: pointArrTemp, size})
}

// 性能数据统计相关
let countTimeStatistics = 0
let tiledRatioStatistics = 0
let drawCounter = 0
let totalCounter = 0

document.getElementById('begin').addEventListener('click', startDrawing)
startDrawing()

// let si = setInterval(() => {
//   startDrawing()
//     if (drawCounter >= 1000) {
//       clearInterval(si)
//     }
// }, 10)