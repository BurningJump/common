



setTimeout(function (){
	$("#head form#form.fm").attr("target", "_top");
	$("#container #page a").attr("target", "_top");
	$("#content_left>div").has("font:contains('-')>a:contains('推广'), font:contains('-')>a:contains('广告'), >a:contains('推广'), >a:contains('商业推广'), >a:contains('广告'), >span:contains('广告')").remove();
	$("div.sponsored").remove();
	$("div[class^='/0-9a-zA-z_{6}/']").remove();
},3000);