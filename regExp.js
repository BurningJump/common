
//1 用户名正则
//用户名正则，4到16位（字母，数字，下划线，减号）
var uPattern = /^[a-zA-Z0-9_-]{4,16}$/;
//输出 true
console.log(uPattern.test("caibaojian"));

//2 密码强度正则
//密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
var pPattern = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/;
//输出 true
console.log("=="+pPattern.test("caibaojian#"));

//3 整数正则
//正整数正则
var posPattern = /^\d+$/;
//负整数正则
var negPattern = /^-\d+$/;
//整数正则
var intPattern = /^-?\d+$/;
//输出 true
console.log(posPattern.test("42"));
//输出 true
console.log(negPattern.test("-42"));
//输出 true
console.log(intPattern.test("-42"));

//4 数字正则 可以是整数也可以是浮点数
//正数正则
var posPattern = /^\d*\.?\d+$/;
//负数正则
var negPattern = /^-\d*\.?\d+$/;
//数字正则
var numPattern = /^-?\d*\.?\d+$/;
console.log(posPattern.test("42.2"));
console.log(negPattern.test("-42.2"));
console.log(numPattern.test("-42.2"));

//5 Email正则
var ePattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
//输出 true
console.log(ePattern.test("99154507@qq.com"));

//6 手机号正则
var mPattern = /^1[34578]\d{9}$/; //http://caibaojian.com/regexp-example.html
//输出 true
console.log(mPattern.test("15507621888"));

//7 身份证号（18位）正则
var cP = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
//输出 true
console.log(cP.test("11010519880605371X"));

//8 URL正则
var urlP= /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
//输出 true
console.log(urlP.test("http://caibaojian.com"));

//9 IPv4地址正则
var ipP = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
//输出 true
console.log(ipP.test("115.28.47.26"));

//10 日期正则
//日期正则，简单判定,未做月份及日期的判定
var dP1 = /^\d{4}(\-)\d{1,2}\1\d{1,2}$/;
//输出 true
console.log(dP1.test("2017-05-11"));
//输出 true
console.log(dP1.test("2017-15-11"));
//日期正则，复杂判定
var dP2 = /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/;
//输出 true
console.log(dP2.test("2017-02-11"));
//输出 false
console.log(dP2.test("2017-15-11"));
//输出 false
console.log(dP2.test("2017-02-29"));

//11 QQ号正则，5至11位
var qqPattern = /^[1-9][0-9]{4,10}$/;
//输出 true
console.log(qqPattern.test("65974040"));

//12 微信号正则，6至20位，以字母开头，字母，数字，减号，下划线
var wxPattern = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/;
//输出 true
console.log(wxPattern.test("caibaojian_com"));

//13 车牌号正则
var cPattern = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
//输出 true
console.log(cPattern.test("粤B39006"));

//14 包含中文正则
var cnPattern = /[\u4E00-\u9FA5]/;
//输出 true
console.log(cnPattern.test("蔡宝坚"));

//15 匹配16进制颜色值
var regex = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/g;
var string = "#ffbbad #Fc01DF #FFF #ffE";
console.log( string.match(regex) ); 
// => ["#ffbbad", "#Fc01DF", "#FFF", "#ffE"]

//16 十六进制颜色正则
//RGB Hex颜色正则
var cPattern = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
//输出 true
console.log(cPattern.test("#b8b8b8"));

//17 24小时时间
/*共4位数字，第一位数字可以为[0-2]。
当第1位为2时，第2位可以为[0-3]，其他情况时，第2位为[0-9]。
第3位数字为[0-5]，第4位为[0-9]*/
var regex = /^([01][0-9]|[2][0-3]):[0-5][0-9]$/;
console.log( regex.test("23:59") ); 
console.log( regex.test("02:07") ); 
// => true
// => true

//如果也要求匹配7:9，也就是说时分前面的0可以省略.
var regex = /^(0?[0-9]|1[0-9]|[2][0-3]):(0?[0-9]|[1-5][0-9])$/;
console.log( regex.test("23:59") ); 
console.log( regex.test("02:07") ); 
console.log( regex.test("7:9") ); 
// => true
// => true
// => true

//18 日期
var regex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
console.log( regex.test("2017-06-10") ); 
// => true

//19 window操作系统文件路径
/*分析：
整体模式是: 盘符:\文件夹\文件夹\文件夹\
其中匹配F:\，需要使用[a-zA-Z]:\\，其中盘符不区分大小写，注意\字符需要转义。
文件名或者文件夹名，不能包含一些特殊字符，此时我们需要排除字符组[^\\:*<>|"?\r\n/]来表示合法字符。
另外不能为空名，至少有一个字符，也就是要使用量词+。因此匹配“文件夹\”，可用[^\\:*<>|"?\r\n/]+\\。
另外“文件夹\”，可以出现任意次。也就是([^\\:*<>|"?\r\n/]+\\)*。其中括号提供子表达式。
路径的最后一部分可以是“文件夹”，没有\，因此需要添加([^\\:*<>|"?\r\n/]+)?。
最后拼接成了一个看起来比较复杂的正则：*/
var regex = /^[a-zA-Z]:\\([^\\:*<>|"?\r\n/]+\\)*([^\\:*<>|"?\r\n/]+)?$/;
console.log( regex.test("F:\\study\\javascript\\regex\\regular expression.pdf") ); 
console.log( regex.test("F:\\study\\javascript\\regex\\") ); 
console.log( regex.test("F:\\study\\javascript") ); 
console.log( regex.test("F:\\") ); 
// => true
// => true
// => true
// => true
//其中，JS中字符串表示\时，也要转义。

//20 匹配id
var regex = /id="[^"]*"/
var string = '<div id="container" class="main"></div>';
console.log(string.match(regex)[0]); 
// => id="container"