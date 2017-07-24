var Ball = function(context) {
    this.left = 0
    this.top = 0
    this.radius = 16
    this.velocityX = 3
    this.velocityY = 2
    this.context = context
}

Ball.prototype = {
    paint: function() {
        this.context.beginPath()
        this.context.arc(this.left + this.radius, this.top + this.radius, this.radius, 0, Math.PI * 2, false)
        this.context.fill()
    },

    move: function() {
        this.left += this.velocityX
        this.top  += this.velocityY
    }
}

function handleEdgeCollisions(ball) {
    var ballRight = ball.left + ball.radius * 2,
        ballBottom = ball.top + ball.radius * 2

    if(ball.left < 0) {
        ball.left = 0
        ball.velocityX = -ball.velocityX
    }else if(ballRight > canvas.width) {
        ball.left = canvas.width - ball.radius * 2
        ball.velocityX = -ball.velocityX
    }

    if(ball.top < 0) {
        ball.top = 0
        ball.velocityY = -ball.velocityY
    }else if(ballBottom > canvas.height) {
        ball.top = canvas.height - ball.radius * 2
        ball.velocityY = -ball.velocityY
    }
}

function animate(time) {
    context.clearRect(0, 0, canvas.width, canvas.height)

    ball.move()
    handleEdgeCollisions(ball)
    ball.paint()

    requestAnimationFrame(animate)
}

var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    ball = new Ball(context)

ball.paint()
requestAnimationFrame(animate)