var http=require('http') //发起Http请求
var cheerio=require('cheerio') //调用cheerio
var url='http://www.imooc.com/learn/348' //访问地址为http://www.imooc.com/learn/348


//筛选过滤 ——获取数据函数
function filterChapters(html){
  var $=cheerio.load(html);              //使用cheerio载入html源代码
  var chapters=$('.chapter')             //获取chapter类的数据
  var courseDate=[];                     //课程数据初始化


//js的forEach循环
  chapters.each(function(item){
    var chapter=$(this);
    var chapterTitle = chapter.find('strong').text();  //strong标签里面的text
		var videos = chapter.find('.video').find('li');    //video的子类li
    var chapterDate = {
      chapterTitle : chapterTitle,
      videos : []
    }
    videos.each(function(item){
      var video = $(this).find('.J-media-item');
      var videoTitle = video.text();
      var videoId = video.attr('href').split('video/')[1];
      chapterDate.videos.push({
        title : videoTitle,
        id : videoId
      })
    })
    courseDate.push(chapterDate);        //push 添加入栈

  })
  	return courseDate;                   //返回
}


//打印输出
function printCourseDate(courseDate){
	courseDate.forEach(function(item){
		console.log(item.chapterTitle + '\n');
		item.videos.forEach(function(video){
				console.log('[' + video.id + ']' + video.title );
		})
	})
}

//get 请求
http.get(url,function(res){
    var html='';//初始化
    res.on('data',function(data){
      html+=data;

    })
    res.on('end',function(){
      var courseData=filterChapters(html); //获取数据
      printCourseDate(courseData);         //输出数据

    })
}).on('error',function(){
  console.log('timeout');                 //超时错误
})
