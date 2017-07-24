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


// 业务代码.......
var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')
var isCollisions = false

var Circle = function(context) {
  this.left = 0
  this.top = 0
  this.radius = 40
  this.context = context
}

Circle.prototype = {
  paint: function() {
    // context.fillRect(this.left, this.top, this.width, this.height)
    context.beginPath()
    context.arc(this.left + this.radius, this.top + this.radius, this.radius,
                0, Math.PI * 2, false)
    context.fill()

  }
}
var circle1 = new Circle(context)
var circle2 = new Circle(context)

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height)

  context.save()
  context.fillStyle = 'cornflowerblue';
  context.font = '24px Arial';
  if(isCollisions) {
    context.fillText('collision', 15, canvas.height - 10);
  } else {
    context.fillText('通过↑↓←→键移动元素', 15, canvas.height - 10)
  }
  context.restore()

  context.save()
  context.fillStyle = 'red'
  circle2.left = 100
  circle2.top = 10
  circle2.paint()
  context.restore()
  circle1.paint()

}

function handleEgdeCollisions(circle1, circle2) {
  var circle1X = circle1.left + circle1.radius
    circle1Y = circle1.top + circle1.radius
    circle2X = circle2.left + circle2.radius
    circle2Y = circle2.top + circle2.radius
  var distance = Math.sqrt(Math.pow(circle1X - circle2X, 2) + Math.pow(circle1Y - circle2Y, 2))
  if(distance < circle1.radius + circle2.radius) {
    console.log('撞了')
    return true
  } else {
    console.log('没撞')
    return false
  }
}
draw()

function keyPressHandle(e) {
  e.preventDefault()
  keyPress.keyPressed(e)
  isCollisions = handleEgdeCollisions(circle1, circle2)
  draw()
}

window.addEventListener('keypress', keyPressHandle, false)
window.addEventListener('keydown',  keyPressHandle, false)

var keyPress = new KeyPress()
keyPress.addKeyListener({
  key: 'right',
  listener: function() {
    circle1.left += 2
  }
})

keyPress.addKeyListener({
  key: 'left',
  listener: function() {
    circle1.left -= 2
  }
})

keyPress.addKeyListener({
  key: 'up',
  listener: function() {
    circle1.top -= 2
  }
})

keyPress.addKeyListener({
  key: 'down',
  listener: function() {
    circle1.top += 2
  }
})