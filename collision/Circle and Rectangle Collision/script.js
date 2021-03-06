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


var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')
var isCollisions = false

    var Rectangle = function(context) {
        this.x = 0
        this.y = 0
        this.w = 50
        this.h = 50
        this.context = context
    }

    var Circle = function(context) {
        this.x = 100
        this.y = 100
        this.r = 30
        this.context = context
    }

    Rectangle.prototype = {
        paint: function() {
            context.beginPath()
            context.fillRect(this.x, this.y, this.w, this.h)
            context.closePath()
        }
    }

    Circle.prototype = {
        paint: function() {
            context.beginPath()
            context.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
            context.closePath()
            context.fill()
        }
    }

    var rect = new Rectangle(context)
    var circle = new Circle(context)
    

    function detectCollision(rect, circle) {
        var cx, cy

        if(circle.x < rect.x) {
            cx = rect.x
        } else if(circle.x > rect.x + rect.w) {
            cx = rect.x + rect.w
        } else {
            cx = circle.x
        }

        if(circle.y < rect.y) {
            cy = rect.y
        } else if(circle.y > rect.y + rect.h) {
            cy = rect.y + rect.h
        } else {
            cy = circle.y
        }

        if(distance(circle.x, circle.y, cx, cy) < circle.r) {
            return true
        }

        return false
    }

    function distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
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
        circle.paint()
        context.restore()
        rect.paint()
    }

    function keyPressHandle(e) {
    e.preventDefault()
        keyPress.keyPressed(e)
        isCollisions = detectCollision(rect, circle)
        draw()
    }

    draw()

    window.addEventListener('keypress', keyPressHandle, false)
    window.addEventListener('keydown',  keyPressHandle, false)


    var keyPress = new KeyPress()
    keyPress.addKeyListener({
        key: 'right',
        listener: function() {
            rect.x += 2
        }
    })

    keyPress.addKeyListener({
        key: 'left',
        listener: function() {
            rect.x -= 2
        }
    })

    keyPress.addKeyListener({
        key: 'up',
        listener: function() {
            rect.y -= 2
        }
    })

    keyPress.addKeyListener({
        key: 'down',
        listener: function() {
            rect.y += 2
        }
    })