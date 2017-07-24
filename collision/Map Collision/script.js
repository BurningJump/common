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

// 业务代码............
var canvas = document.getElementById('canvas'),
  context = canvas.getContext('2d'),
  map = [
    [0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 1, 1, 0, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0, 0]
  ],
  player= {left: 2, top: 2},
  CELL_WIDTH = 30,
  CELL_HEIGHT = 30;


function paintMap(context) {
  for(var i = 0, iLen = map.length; i < iLen; i++) {
    for(var j = 0, jLen = map[i].length; j < jLen; j++) {
      if(map[i][j] === 1) {
        context.fillRect(j * CELL_WIDTH, i * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT)
      }
    }
  }
}

function paintPlayer(context) {
  context.save()
  context.fillStyle = 'red'
  context.fillRect(player.left * CELL_WIDTH, player.top * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT)
  context.restore()
}

function handleEgdeCollisions(player, map) {
  if(map[player.top][player.left] === 1) {
    // 撞了
    return true
  } else {
    return false
  }
}
function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height)

  context.save()
  context.fillStyle = 'cornflowerblue';
  context.font = '22px Arial';
  context.fillText('通过↑↓←→键移动元素', 15, canvas.height - 10)
  context.restore()

  context.save()
  paintMap(context)
  paintPlayer(context)
  context.restore()
}

var keyPress = new KeyPress()

  keyPress.addKeyListener({
  key: 'right',
  listener: function() {
    player.left += 1
    if(handleEgdeCollisions(player, map)) {
      player.left -= 1
    }
  }
})

keyPress.addKeyListener({
  key: 'left',
  listener: function() {
    player.left -= 1
    if(handleEgdeCollisions(player, map)) {
      player.left += 1
    }
  }
})

keyPress.addKeyListener({
  key: 'up',
  listener: function() {
    player.top -= 1
    if(handleEgdeCollisions(player, map)) {
      player.top += 1
    }
  }
})

keyPress.addKeyListener({
  key: 'down',
  listener: function() {
    player.top += 1
    if(handleEgdeCollisions(player, map)) {
      player.top -= 1
    }
  }
})

function keyPressHandle(e) {
  e.preventDefault()
  keyPress.keyPressed(e)
  draw()
}
window.addEventListener('keypress', keyPressHandle, false)
window.addEventListener('keydown',  keyPressHandle, false)

draw()