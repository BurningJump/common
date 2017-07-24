/*
 * Copyright (C) 2012 David Geary. This code is from the book
 * Core HTML5 Canvas, published by Prentice-Hall in 2012.
 *
 * License:
 *
 * Permission is hereby granted, free of charge, to any person 
 * obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * The Software may not be used to create training material of any sort,
 * including courses, books, instructional videos, presentations, etc.
 * without the express written consent of David Geary.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
*/

window.requestNextAnimationFrame =
   (function () {
      var originalWebkitRequestAnimationFrame = undefined,
          wrapper = undefined,
          callback = undefined,
          geckoVersion = 0,
          userAgent = navigator.userAgent,
          index = 0,
          self = this;

      // Workaround for Chrome 10 bug where Chrome
      // does not pass the time to the animation function
      
      if (window.webkitRequestAnimationFrame) {
         // Define the wrapper

         wrapper = function (time) {
           if (time === undefined) {
              time = +new Date();
           }
           self.callback(time);
         };

         // Make the switch
          
         originalWebkitRequestAnimationFrame = window.webkitRequestAnimationFrame;    

         window.webkitRequestAnimationFrame = function (callback, element) {
            self.callback = callback;

            // Browser calls the wrapper and wrapper calls the callback
            
            originalWebkitRequestAnimationFrame(wrapper, element);
         }
      }

      // Workaround for Gecko 2.0, which has a bug in
      // mozRequestAnimationFrame() that restricts animations
      // to 30-40 fps.

      if (window.mozRequestAnimationFrame) {
         // Check the Gecko version. Gecko is used by browsers
         // other than Firefox. Gecko 2.0 corresponds to
         // Firefox 4.0.
         
         index = userAgent.indexOf('rv:');

         if (userAgent.indexOf('Gecko') != -1) {
            geckoVersion = userAgent.substr(index + 3, 3);

            if (geckoVersion === '2.0') {
               // Forces the return statement to fall through
               // to the setTimeout() function.

               window.mozRequestAnimationFrame = undefined;
            }
         }
      }
      
      return window.requestAnimationFrame   ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame    ||
         window.oRequestAnimationFrame      ||
         window.msRequestAnimationFrame     ||

         function (callback, element) {
            var start,
                finish;

            window.setTimeout( function () {
               start = +new Date();
               callback(start);
               finish = +new Date();

               self.timeout = 1000 / 60 - (finish - start);

            }, self.timeout);
         };
      }
   )
();


// sprite.js

var ImagePainter = function (imageUrl) {
   this.image = new Image;
   this.image.src = imageUrl;
};

ImagePainter.prototype = {
   image: undefined,

   paint: function (sprite, context) {
      if (this.image !== undefined) {
         if ( ! this.image.complete) {
            this.image.onload = function (e) {
               sprite.width = this.width;
               sprite.height = this.height;
               
               context.drawImage(this,  // this is image
                  sprite.left, sprite.top,
                  sprite.width, sprite.height);
            };
         }
         else {
           context.drawImage(this.image, sprite.left, sprite.top,
                             sprite.width, sprite.height); 
         }
      }
   }
};

SpriteSheetPainter = function (cells) {
   this.cells = cells;
};

SpriteSheetPainter.prototype = {
   cells: [],
   cellIndex: 0,

   advance: function () {
      if (this.cellIndex == this.cells.length-1) {
         this.cellIndex = 0;
      }
      else {
         this.cellIndex++;
      }
   },
   
   paint: function (sprite, context) {
      var cell = this.cells[this.cellIndex];
      context.drawImage(spritesheet, cell.left, cell.top,
                                     cell.width, cell.height,
                                     sprite.left, sprite.top,
                                     cell.width, cell.height);
   }
};

// Sprite Animators...........................................................

// Sprite animators have an array of painters that they succesively apply
// to a sprite over a period of time. Animators can be started with 
// start(sprite, durationInMillis, restoreSprite)

var SpriteAnimator = function (painters, elapsedCallback) {
   this.painters = painters;
   if (elapsedCallback) {
      this.elapsedCallback = elapsedCallback;
   }
};

SpriteAnimator.prototype = {
   painters: [],
   duration: 1000,
   startTime: 0,
   index: 0,
   elapsedCallback: undefined,

   end: function (sprite, originalPainter) {
      sprite.animating = false;

      if (this.elapsedCallback) {
         this.elapsedCallback(sprite);
      }
      else {
         sprite.painter = originalPainter;
      }              
   },
   
   start: function (sprite, duration) {
      var endTime = +new Date() + duration,
          period = duration / (this.painters.length),
          interval = undefined,
          animator = this, // for setInterval() function
          originalPainter = sprite.painter;

      this.index = 0;
      sprite.animating = true;
      sprite.painter = this.painters[this.index];

      interval = setInterval(function() {
         if (+new Date() < endTime) {
            sprite.painter = animator.painters[++animator.index];
         }
         else {
            animator.end(sprite, originalPainter);
            clearInterval(interval);
         }
      }, period); 
   },
};

// Sprites....................................................................

// Sprites have a name, a painter, and an array of behaviors. Sprites can
// be updated, and painted.
//
// A sprite's painter paints the sprite: paint(sprite, context)
// A sprite's behavior executes: execute(sprite, context, time)

var Sprite = function (name, painter, behaviors) {
   if (name !== undefined)      this.name = name;
   if (painter !== undefined)   this.painter = painter;
   if (behaviors !== undefined) this.behaviors = behaviors;

   return this;
};

Sprite.prototype = {
   left: 0,
   top: 0,
   width: 10,
   height: 10,
    velocityX: 0,
    velocityY: 0,
   visible: true,
   animating: false,
   painter: undefined, // object with paint(sprite, context)
   behaviors: [], // objects with execute(sprite, context, time)

    paint: function (context) {
     if (this.painter !== undefined && this.visible) {
        this.painter.paint(this, context);
     }
    },

   update: function (context, time) {
      for (var i = this.behaviors.length; i > 0; --i) {
         this.behaviors[i-1].execute(this, context, time);
      }
   }
};

// 业务代码......
var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    scoreboard = document.getElementById('scoreboard'),
    launchVelocityOutput = document.getElementById('launchVelocityOutput'),
    launchAngleOutput = document.getElementById('launchAngleOutput'),

    elapsedTime = undefined,
    launchTime = undefined,

    score = 0,
    lastScore = 0,
    lastMouse = { left: 0, top: 0 },

    threePointer = false,
    needInstructions = true,

    LAUNCHPAD_X = 50,
    LAUNCHPAD_Y = context.canvas.height-50,
    LAUNCHPAD_WIDTH = 50,
    LAUNCHPAD_HEIGHT = 12,
    ARENA_LENGTH_IN_METERS = 10,
    INITIAL_LAUNCH_ANGLE = Math.PI/4,

    launchAngle = INITIAL_LAUNCH_ANGLE,
    pixelsPerMeter = canvas.width / ARENA_LENGTH_IN_METERS,

    // LaunchPad.................................................

    launchPadPainter = {
      LAUNCHPAD_FILL_STYLE: 'rgb(100,140,230)',

      paint: function (ledge, context) { 
         context.save();
         context.fillStyle = this.LAUNCHPAD_FILL_STYLE;
         context.fillRect(LAUNCHPAD_X, LAUNCHPAD_Y,
                          LAUNCHPAD_WIDTH, LAUNCHPAD_HEIGHT);
         context.restore();
      }
    },

    launchPad = new Sprite('launchPad', launchPadPainter),

    // Ball......................................................

    BALL_RADIUS = 8,
    lastBallPosition = { left: 0, top: 0 },

    ballPainter = {
      BALL_FILL_STYLE: 'rgb(255,255,0)',
      BALL_STROKE_STYLE: 'rgb(0,0,0,0.4)',
      
      paint: function (ball, context) { 
         context.save();
         context.shadowColor = undefined;
         context.lineWidth = 2;
         context.fillStyle = this.BALL_FILL_STYLE;
         context.strokeStyle = this.BALL_STROKE_STYLE;

         context.beginPath();
         context.arc(ball.left + BALL_RADIUS, ball.top + BALL_RADIUS,
                     ball.radius, 0, Math.PI*2, false);

         context.clip();
         context.fill();
         context.stroke();
         context.restore();
      }
    },

    // Lob behavior..............................................
    
    lob = {
       lastTime: 0,
       GRAVITY_FORCE: 9.81, // m/s/s
       
       applyGravity: function (elapsed) {
          ball.velocityY = (this.GRAVITY_FORCE * elapsed) -
                           (launchVelocity * Math.sin(launchAngle));
       },

       updateBallPosition: function (updateDelta) {
          lastBallPosition.left = ball.left;
          lastBallPosition.top = ball.top;

          ball.left += ball.velocityX * (updateDelta) * pixelsPerMeter;
          ball.top += ball.velocityY * (updateDelta) * pixelsPerMeter;
       },

       checkForThreePointer: function () {
          if (ball.top < 0) {
             threePointer = true;
          }
       },

       checkBallBounds: function () {
          if (ball.top > canvas.height || ball.left > canvas.width)  {
            reset();
         }
       },
       
       execute: function (ball, context, time) {
          var updateDelta,
              elapsedFlightTime;

          if (ballInFlight) {
             elapsedFrameTime  = (time - this.lastTime)/1000,
             elapsedFlightTime = (time - launchTime)/1000;

             this.applyGravity(elapsedFlightTime);
             this.updateBallPosition(elapsedFrameTime);
             this.checkForThreePointer();
             this.checkBallBounds();
          }
          this.lastTime = time;
       }
    },
   
    ball = new Sprite('ball', ballPainter, [ lob ]),
    ballInFlight = false,

    // Bucket....................................................

    BUCKET_LEFT = 668,
    BUCKET_TOP = canvas.height - 100,
    BUCKET_WIDTH = 83,
    BUCKET_HEIGHT = 62,
    bucketHitCenter = { x: BUCKET_LEFT + 2*this.BUCKET_WIDTH/3,
                        y: BUCKET_TOP + BUCKET_HEIGHT/8
                      },

    bucketHitRadius = BUCKET_WIDTH/8,
    bucketImage = new Image(),

    catchBall = {
       intersectionPoint: { x: 0, y: 0 },

       isBallInBucket: function() {  // a posteriori
          if (lastBallPosition.left === ball.left ||
              lastBallPosition.top === ball.top) {
             return;
          }

          var x1 = lastBallPosition.left,
              y1 = lastBallPosition.top,
              x2 = ball.left,
              y2 = ball.top,
              x3 = BUCKET_LEFT + BUCKET_WIDTH/4,
              y3 = BUCKET_TOP,
              x4 = BUCKET_LEFT + BUCKET_WIDTH,
              y4 = y3,
              m1 = (ball.top - lastBallPosition.top) / (ball.left - lastBallPosition.left),

              m2 = (y4 - y3) / (x4 - x3), // zero, but calculate anyway for illustration

              b1 = y1 - m1*x1,
              b2 = y3 - m2*x3;

          this.intersectionPoint.x = (b2 - b1) / (m1 - m2);
          this.intersectionPoint.y = m1*this.intersectionPoint.x + b1;

          return this.intersectionPoint.x > x3 && 
                 this.intersectionPoint.x < x4 && 
                 ball.top + ball.height > y3 &&
                 ball.left + ball.width < x4;
        },
 
        adjustScore: function() {
            if (threePointer) lastScore = 3;
            else              lastScore = 2;
 
            score += lastScore;
            scoreboard.innerText = score;
        },

        drawRay: function() {
           context.beginPath();
           context.save();
           context.lineWidth = 1;
           context.strokeStyle = 'blue';
           context.moveTo(ball.left + BALL_RADIUS, ball.top + BALL_RADIUS);
           context.lineTo(this.intersectionPoint.x, this.intersectionPoint.y);
           context.stroke();
           context.restore();
        },

        execute: function (bucket, context, time) {
           if (ballInFlight) {
              this.drawRay();

              if (this.isBallInBucket()) {
                 reset();
                 this.adjustScore();
              }   
           }   
        }
     },
 
     bucket = new Sprite('bucket', {
          paint: function (sprite, context) {
             context.drawImage(bucketImage, BUCKET_LEFT, BUCKET_TOP);
          }
       },
 
       [ catchBall ]
     );
  
// Functions.....................................................

function freeze() {
   ball.velocityX = 0;
   ball.velocityY = 0;
   ballInFlight = false;
   needInstructions = false;
}

function reset() {
   lastBallPosition.left = ball.left;
   lastBallPosition.top = ball.top;

   ball.left = LAUNCHPAD_X + LAUNCHPAD_WIDTH/2 - BALL_RADIUS;
   ball.top = LAUNCHPAD_Y - ball.height/2 - BALL_RADIUS;

   ball.velocityX = 0;
   ball.velocityY = 0;
   ballInFlight = false;
   needInstructions = false;
   lastScore = 0;
}

function showText(text) {
   var metrics;

   context.font = '42px Helvetica';
   metrics = context.measureText(text);

   context.save();
   context.shadowColor = undefined;
   context.strokeStyle = 'rgb(80,120,210)';
   context.fillStyle = 'rgba(100,140,230,0.5)';

   context.fillText(text,
                    canvas.width/2 - metrics.width/2,
                    canvas.height/2);

   context.strokeText(text,
                      canvas.width/2 - metrics.width/2,
                      canvas.height/2);
   context.restore();
}

function drawRubberband() {
   context.beginPath();
   context.moveTo(ball.left + BALL_RADIUS, ball.top + BALL_RADIUS);
   context.lineTo(bucketHitCenter.x, bucketHitCenter.y);
   context.stroke();
};

function drawGuidewire() {
   context.moveTo(ball.left + BALL_RADIUS, ball.top + BALL_RADIUS);
   context.lineTo(lastMouse.left, lastMouse.top);
   context.stroke();
};

function updateBackgroundText() {
   if (lastScore == 3)        showText('三分!');
   else if (lastScore == 2)   showText('好球!');
   else if (needInstructions) showText('点击发球'); 
};

function resetScoreLater() {
   setTimeout(function () {
      lastScore = 0;
   }, 1000);
};

function updateSprites(time) {
   bucket.update(context, time);
   launchPad.update(context, time);
   ball.update(context, time);
}

function paintSprites() {
   launchPad.paint(context);
   bucket.paint(context);
   ball.paint(context);
}

function mouseToCanvas(e) {
   var rect = canvas.getBoundingClientRect(),
       loc = { x: e.x || e.clientX,
               y: e.y || e.clientY
             };

   loc.x -= rect.left;
   loc.y -= rect.top;

   return loc;
}

// Event handlers................................................
var initTime = +new Date
canvas.onmousedown = function(e) {
   var rect;

   e.preventDefault();

   if ( ! ballInFlight) {
     ball.velocityX = launchVelocity * Math.cos(launchAngle);
     ball.velocityY = launchVelocity * Math.sin(launchAngle);
     ballInFlight = true;
     threePointer = false;
     launchTime = +new Date() - initTime;
   }
};

canvas.onmousemove = function (e) {
   var rect;

   e.preventDefault();

   if ( ! ballInFlight) {
      loc = mouseToCanvas(e);
      lastMouse.left = loc.x;
      lastMouse.top = loc.y;

      deltaX = Math.abs(lastMouse.left - ball.left);
      deltaY = Math.abs(lastMouse.top - ball.top);

      launchAngle = Math.atan(parseFloat(deltaY) / parseFloat(deltaX));
      launchVelocity = 4 * deltaY / Math.sin(launchAngle) / pixelsPerMeter;

      launchVelocityOutput.innerText = launchVelocity.toFixed(2);
      launchAngleOutput.innerText = (launchAngle * 180/Math.PI).toFixed(2);
   }
};

// Animation Loop................................................

function animate(time) {
   elapsedTime = (time - launchTime) / 1000;
   context.clearRect(0,0,canvas.width,canvas.height);

   if (!ballInFlight) {
      drawGuidewire();
      updateBackgroundText();

      if (lastScore !== 0) { // just scored
         resetScoreLater();      
      }
   }

   paintSprites();
   updateSprites(time);

   //drawRubberband();

   context.save();
   context.beginPath();
   context.lineWidth = 0.5;
   context.strokeStyle = 'red';
   context.moveTo(0, BUCKET_TOP+0.5);
   context.lineTo(canvas.width, BUCKET_TOP);
   context.stroke();
   context.restore();
   
   window.requestNextAnimationFrame(animate);
}

// Initialization................................................

ball.width = BALL_RADIUS*2;
ball.height = ball.width;
ball.left = LAUNCHPAD_X + LAUNCHPAD_WIDTH/2 - BALL_RADIUS;
ball.top = LAUNCHPAD_Y - ball.height/2 - BALL_RADIUS;
lastBallPosition.left = ball.left;
lastBallPosition.top = ball.top;
ball.radius = BALL_RADIUS;
 
context.lineWidth = 0.5;
context.strokeStyle = 'rgba(0,0,0,0.5)';
context.shadowColor = 'rgba(0,0,0,0.5)';
context.shadowOffsetX = 2;
context.shadowOffsetY = 2;
context.shadowBlur = 4; 
context.stroke();

bucketImage.onload = function (e) {
   bucket.left = BUCKET_LEFT;
   bucket.top = BUCKET_TOP;
   bucket.width = BUCKET_WIDTH;
   bucket.height = BUCKET_HEIGHT;
};

animate();

bucketImage.src = 'data:image/png;base64,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';