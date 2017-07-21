//常用函数

//鼠标移动速度，即每秒移动的像素数量
function mouseMoveVelocity(){
    var previousX;
    var previousY;
    var previousT;

    window.addEventListener('mousemove', function(event) {
        if (!(previousX === undefined ||
              previousY === undefined ||
              previousT === undefined)) {
            var deltaX = event.screenX - previousX;
            var deltaY = event.screenY - previousY;
            var deltaD = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
        
            var deltaT = event.timeStamp - previousT;
            console.log(deltaD / deltaT * 1000);
        }
    
        previousX = event.screenX;
        previousY = event.screenY;
        previousT = event.timeStamp;
    });
}