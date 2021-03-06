function KeyPress() {
    this.keyListeners = []
}

KeyPress.prototype = {
    addKeyListener: function(keyAndListener) {
        this.keyListeners.push(keyAndListener)
    },

    findKeyListener: function(key) {
        var listener = undefined

        this.keyListeners.forEach(function(keyAndListener) {
            var currentKey = keyAndListener.key
            if(currentKey === key) {
                listener = keyAndListener.listener
            }
        })

        return listener
    },

    keyPressed: function(e) {
        var listener = undefined,
            key = undefined

        switch (e.keyCode) {
            case 32: key = 'space'; break;
            case 37: key = 'left'; break;
            case 39: key = 'right'; break;
            case 38: key = 'up'; break;
            case 40: key = 'down'; break;
        }
        listener = this.findKeyListener(key)
        if(listener) {
            listener()
        }
    }
}

// 业务代码..........
var onscreenCanvas = document.getElementById('canvas'),
    onscreenContext = onscreenCanvas.getContext('2d'),
    offscreenCanvasPanda = document.createElement('canvas'),
    offscreenCanvasBamboo = document.createElement('canvas'),
    offscreenContextPanda = offscreenCanvasPanda.getContext('2d'),
    offscreenContextBamboo = offscreenCanvasBamboo.getContext('2d'),
    imageBamboo = new Image(),
    imagePanda = new Image();

var isCollisions = false

offscreenCanvasPanda.id = `panda`
offscreenCanvasBamboo.id = `bamboo`

offscreenCanvasPanda.width = offscreenCanvasBamboo.width = 200
offscreenCanvasPanda.height = offscreenCanvasBamboo.height = 100

var offscreenCanvasWrap = document.getElementById('offscreenCanvasWrap')
offscreenCanvasWrap.querySelector('.panda').appendChild(offscreenCanvasPanda)
offscreenCanvasWrap.querySelector('.bamboo').appendChild(offscreenCanvasBamboo)

function Sprite(arg) {
  this.left = arg.left || 0
  this.top = arg.top || 0
  this.width = arg.width || 10
  this.height = arg.height || 10
  this.visible = true
  this.image = arg.image
}

Sprite.prototype = {
  paint: function(context) {
    if(this.visible) {
      context.save()
      context.drawImage(this.image, 0, 0, this.image.width, this.image.height,
                        this.left, this.top, this.width, this.height)
      context.restore()
    }
  }
}

function detectIntersection(rect1, rect2) {
  var rect2CenterX = rect2.left + rect2.width/2,
    rect2CenterY = rect2.top + rect2.height/2,
    rect1CenterX = rect1.left + rect1.width/2,
    rect1CenterY = rect1.top + rect1.height/2;

    // 加上 = 就是相切
    if((Math.abs(rect2CenterX - rect1CenterX) < rect1.width / 2 + rect2.width / 2) &&
        Math.abs(rect2CenterY - rect1CenterY) < rect1.height / 2 + rect2.height / 2) {
      return true
    } else {
      return false
    }
}

function getIntersectionRect(rect1, rect2) {
  var rect1Right = rect1.left + rect1.width,
    rect1Bottom = rect1.top + rect1.height,
    rect2Right = rect2.left + rect2.width,
    rect2Bottom = rect2.top + rect2.height;

  var rect3Left = Math.max(rect1.left, rect2.left),
    rect3Top = Math.max(rect1.top, rect2.top),
    rect3Right = Math.min(rect1Right, rect2Right),
    rect3Bottom = Math.min(rect1Bottom, rect2Bottom);

  return {
    left: rect3Left,
    top: rect3Top,
    width: rect3Right - rect3Left,
    height: rect3Bottom - rect3Top
  }
}

// rect 是交集矩形
function handleEgdeCollisions(rect) {
  // console.log(rect)
  var imgData1 = offscreenContextPanda.getImageData(rect.left, rect.top, rect.width, rect.height),
    imgData2 = offscreenContextBamboo.getImageData(rect.left, rect.top, rect.width, rect.height);
  var imgData1Data = imgData1.data
  var imgData2Data = imgData2.data

  for(var i = 3, len = imgData1Data.length; i < len; i += 4) {
    if(imgData1Data[i] > 0 && imgData2Data[i] > 0) {
      console.log('撞了')
      return true
    }
  }
  return false
}

var bamboo = new Sprite({
  width: 30,
  height: 30,
  left: 60,
  top: 10,
  image: imageBamboo
})

var panda = new Sprite({
  width: 30,
  height: 30,
  top: 10,
  left: 10,
  image: imagePanda
})


var keyPress = new KeyPress()
  keyPress.addKeyListener({
  key: 'right',
  listener: function() {
    panda.left += 1
  }
})

keyPress.addKeyListener({
  key: 'left',
  listener: function() {
    panda.left -= 1
  }
})

keyPress.addKeyListener({
  key: 'up',
  listener: function() {
    panda.top -= 1
  }
})

keyPress.addKeyListener({
  key: 'down',
  listener: function() {
    panda.top += 1
  }
})

window.addEventListener('keypress', function(e) {
  e.preventDefault()
  keypressHandle(e)
}, false)
window.addEventListener('keydown', function(e) {
  e.preventDefault()
  keypressHandle(e)
}, false)

function draw() {
  onscreenContext.clearRect(0, 0, onscreenCanvas.width, onscreenCanvas.height)
  offscreenContextPanda.clearRect(0, 0, offscreenCanvasPanda.width, offscreenCanvasPanda.height)
  offscreenContextBamboo.clearRect(0, 0, offscreenContextBamboo.width, offscreenContextBamboo.height)

  bamboo.paint(offscreenContextBamboo)
  panda.paint(offscreenContextPanda)
  bamboo.paint(onscreenContext)
  panda.paint(onscreenContext)

  onscreenContext.save()
  onscreenContext.font = '16px Arial';

  if(isCollisions) {
    onscreenContext.fillText('collision', 15, canvas.height - 10);
  } else {
    onscreenContext.fillText('通过↑↓←→键移动元素', 15, canvas.height - 10);
  }
  onscreenContext.restore()
}

imagePanda.onload = function() {
  draw()
}

function keypressHandle(e) {
  keyPress.keyPressed(e)
  if(detectIntersection(panda, bamboo)) {
    var intersectionRect = getIntersectionRect(panda, bamboo)
    isCollisions = handleEgdeCollisions(intersectionRect)
  }
  draw()
}


imageBamboo.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAA+VBMVEUAAAD/23j/02qM3XCL4G2L4W6P53CM4G2M4W6K5HCL4W2L42z/3HeM4mz/33CM4G3/23iM4W3/3HiM4G7/23Z9yW6N4m2M4W7/3HeM4G2M4G7/02uM4W6L4G3/12+M4W18yG6O4219ym3/0mj/1mP/3Hj/0Gb/0Wf/02v/3Xj03Hf71G/mt1W00XJ8x219yG7/02p9yG7/0mr/02z/1Wv/3Hh7yW7/23iAx3D/3HiM4W7/z2V9yG7/tFD/0m6H2G7/2XOAzm6I225/zG7/1m6D022L3m59ym3/23b/02rE03P/0We+vl/O1HSezXHfuVfv1XLv1HH302/ZYKBeAAAAOXRSTlMAwMAQ8IAg0KEwcEDhUBC/gLCg79HPYF/w4N/bkMCvn4A/8Ocfv/z3uH9x9+zh4N/PsKackmBfQCBAJBT6AAADfElEQVR42u2be1ebMBiH01GggJVitV21tZfNbbr7fcTMCh2o3XSX7/9hphB8KU1PIeyEnZ48f5f8Ht6QnJQQxMnJkbvA7vE2EgnEg4JIg5bLYAeJY4sl8BCJ49JlgcRxwMrfQuJ4/y3i3E3TQgI5OI34nlKoIaEcnsacw/0L5l0scAX5onkSG8AQFM2jtEANieeBFJACUkAKSAEpIAU2WKCPbatSgR7GoFCFgIrv0LuVCSh1HLHfFS4AJQAFoQJQAlAQKwAlAIWmUAEoAWBbwgVQAy9ga6IFNJxhqIgUgBIAbVOsgIaXsJXyAsa4eAmAtlFCwGiqjo4xNjlKAAYKl8DYHNo4weKYC4BGUQHDHOo4TYdrLgCMAgJa12njDCoC+EqQW0AZrri8ZAnyChj73PmACZcGXoAjmvkENCg+oHMsjShTQsgMbmK9gM7KV1BRmpjikcRAzyWglssHBjjGJ/cGawVgDgl58wGtDn1ADawcr+mc6LEhJID8uoG4MHHGAGYS+rbYjdlGgHX3+xm5hTsfcLIG6uLr6ivGdkkD+1E8uQghnxelkTGIh8Fjmn966VIO72ughR6J833I5xcY9xcNJspd/lN6/1F+zBY1+LJH4wOoP0fsWFUdG0ZzymDv1uDZeQRj00oZkRgvxBRdKxRtDtO5bIPVm1ajCcRTBgrHY7/OwGWCPr2m8T5O6JmoGEY9j8Euc9Mq6fxpavppoqJogxwGL1kCc4hP0e5rqCDN+nqD+XL+NTz6Gexu0THQxwwCb+qDwc3891mKP9c3hDLzPC/wM2VQC5bBWh4I8eRy23QYG5AfX1P8JBlCnMGxUCHMbD9A27M8Aj5eYr/LMQcDAQEYAq9Go9HbvZmXSGIWZql+mHoXqwVepAex7/uYRb3wmOxk+iH0g+QWb+a/zlI83/kcG4B0hoFqoOIoKl7Cn04m5HrV9wuKwwjv9ZsK4kRrLLXWQejEZdBiTiO9RkdDQGkFJ+pH9lR8X7ZEQe9DeDkF2uLApO25TKDnLFVVOxb6h1iqaRn/0TckKxYkgli9JBMHe1EqljfZZblA2H9M8iO/oJACUkAKSAEpIAWkgBSQAlJACkgBKSAFpIAUkAJSYFMEKn9NV/VRr8PqDruxj/sdI3GwDzweIYF8qPrI526JQ6+bcey38k2ryo9+o1pFh9+Bj7VMfIsz/y/lvfIaf2yiCQAAAABJRU5ErkJggg=='
imagePanda.src = 'data:image/png;base64,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'
