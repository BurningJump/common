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


//弹出虚拟键盘时input自动上移
function focus(){
    let _this = this;
    setTimeout(function(){
        let pannel = document.getElementById('chatpannel');//输入框所在块
        //let pannel = _this.$refs.chatpannel;//vue.js中
        pannel.scrollIntoView(true);
    },200);//键盘弹起需要时间
}



//移动设备摇一摇事件
//y轴和x轴的变化范围从-45°到+45°，即这个区间是：
//delta = 9.8 * sin(45°) * 2 = 13.8
//即只要x轴和y轴的g值变化超过13.8，我们就认为发生了摇一摇事件。
const EMPTY_VALUE = 100;
const THREAD_HOLD = 13.8;
var minX = EMPTY_VALUE,
    minY = EMPTY_VALUE;
window.ondevicemotion = function(event){
    var gravity = event.accelerationIncludingGravity,
        x = gravity.x,
        y = gravity.y;
    if(x < minX) minX = x;
    if(y < minY) minY = y;
    if(Math.abs(x - minX) > THREAD_HOLD &&  
            Math.abs(y - minY) > THREAD_HOLD){
        console.log("shake");
        var event = new CustomEvent("shake");
        window.dispatchEvent(event);
        minX = minY = EMPTY_VALUE;
    }   
}   
    
window.addEventListener("shake", function(){
    console.log("window shake callback was called");
});