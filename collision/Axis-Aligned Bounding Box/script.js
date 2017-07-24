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

var Rectangle = function(context) {
    this.left = 0
    this.top = 0
    this.width = 50
    this.height = 50
    this.context = context
}

Rectangle.prototype = {
    paint: function() {
        context.fillRect(this.left, this.top, this.width, this.height)
    }
}

var rect1 = new Rectangle(context)
var rect2 = new Rectangle(context)


function handleEgdeCollisions(rect1, rect2) {
    if(rect1.left < rect2.left + rect2.width &&
    rect1.left + rect1.width > rect2.left &&
    rect1.top < rect2.top + rect2.height &&
    rect1.height + rect1.top > rect2.top) {
        console.log('撞了')
  return true
    } else {
        console.log('没撞')
        return false
    }
}

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
    rect2.left = 70
    rect2.top = 50
    rect2.paint()
    context.restore()
    rect1.paint()
}

function keyPressHandle(e) {
    e.preventDefault()
    keyPress.keyPressed(e)
    isCollisions = handleEgdeCollisions(rect1, rect2)
    draw()
}

window.addEventListener('keypress', keyPressHandle, false)
window.addEventListener('keydown',  keyPressHandle, false)

draw()

var keyPress = new KeyPress()
keyPress.addKeyListener({
    key: 'right',
    listener: function() {
        rect1.left += 2
    }
})

keyPress.addKeyListener({
    key: 'left',
    listener: function() {
        rect1.left -= 2
    }
})

keyPress.addKeyListener({
    key: 'up',
    listener: function() {
        rect1.top -= 2
    }
})

keyPress.addKeyListener({
    key: 'down',
    listener: function() {
        rect1.top += 2
    }
})