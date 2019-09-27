
let loadingRender = (function  () {
	//根据加载图片的百分比来给进度条设置百分比
	//1.获取元素
	let $loadingBox = $(".loadingBox"),
		$pro = $loadingBox.find(".pro");
	let imgData = ["img/icon.png","img/zf_concatAddress.png","img/zf_concatInfo.png","img/zf_concatPhone.png","img/zf_course.png","img/zf_course1.png","img/zf_course2.png","img/zf_course3.png","img/zf_course4.png","img/zf_course5.png","img/zf_course6.png","img/zf_cube1.png","img/zf_cube2.png","img/zf_cube3.png","img/zf_cube4.png","img/zf_cube5.png","img/zf_cube6.png","img/zf_cubeBg.jpg","img/zf_cubeTip.png","img/zf_emploment.png","img/zf_messageArrow1.png","img/zf_messageArrow2.png","img/zf_messageChat.png","img/zf_messageKeyboard.png","img/zf_messageLogo.png","img/zf_messageStudent.png","img/zf_outline.png","img/zf_phoneBg.jpg","img/zf_phoneDetail.png","img/zf_phoneListen.png","img/zf_phoneLogo.png","img/zf_return.png","img/zf_style1.jpg","img/zf_style2.jpg","img/zf_style3.jpg","img/zf_styleTip1.png","img/zf_styleTip2.png","img/zf_teacher1.png","img/zf_teacher2.png","img/zf_teacher3.jpg","img/zf_teacher4.png","img/zf_teacher5.png","img/zf_teacher6.png","img/zf_teacherTip.png"];
	//2.预加载图片
	let loadingImg = function  (getback) {
		let allImg = imgData.length,
			imged = 0;
		//遍历数组中的每一项：1.加载里面的图片 2.算出已加载图片的比例 3.给进度条的width赋值
		imgData.forEach(item=>{
			let curImg = new Image();
			curImg.onload =function  () {
				curImg = null
				$pro.css("width",(++imged/allImg)*100+"%")//*单位需要另外写*/
				//若加载完毕就执行回调函数
				if(imged>=allImg){
					getback && getback();
				}
			}
			curImg.src = item;
		});
	};
	//3.加载图片超过指定的时间
	/*console.log(imged);
	let timer = null;
	let maxTime = function maxTime () {
		timer = setInterval(function  () {
				
			},10000)
	}*/
	//4.加载成功
	let hiddenShow = function hiddenShow () {
		$loadingBox.remove();
		listen.init();
	//	$listen.style.display = "block";
	}
	
		return{
		init:function  () {
			$loadingBox.css("display","block");
			loadingImg(hiddenShow);
		}
	}
})();
	

let listen = (function  () {
	let $listen = $(".listen"),
		$phone = $listen.find(".phone");
		$Hang = $(".Hang"),
		$timing = $listen.find(".timing"),
		$tell = $(".tell"),
		$hang_up = $(".hang_up"),
		musie = $(".musie")[0],/*音频与视频标签，只能用原生js方法，不能使用zepto或者jQ*/
		myself = $(".myself")[0],
		timer = null;
		//
	//点击tell：点击接听
	let handTell = function  handTell() {
		/* 1.暂停来电音频
		 * 2.隐藏phone，显示Hang
		 * 3.播放音频自我介绍
		 * 4.在timing中显示已播放音频时间
		 * 5.音频播放结束切换页面
		 */
		musie.pause();
		$phone.css("display","none");
		$Hang.css({
			display:"block",
			"transform":"translateY(0)"
		});
		myself.play();
		//用定时器定时播放
		let allTime = myself.duration;
		timer = setInterval(function  () {
			let plaied = myself.currentTime,
			min = parseInt(plaied/60),
			s = parseInt(plaied - min*60);
			min = min<10? "0"+min : min;
			s = (s<10)?("0"+s):s;
		    $timing.text(`${min}:${s}`);
		    //判断音频是否播放完成
		    if(plaied>=allTime){
		    	//播放完成
		    	$listen.remove();
		    	clearInterval(timer);
		    	message.init(); 
		    }
		},1000);
	}
	//手动挂电话:为什么要分开写，不清楚
	let hangUp = function hangUp () {
		$listen.remove();
		clearInterval(timer);
		message.init();
	}
	return{
		init:function  () {
			$listen.css("display","block");/*显示listen区域*/
			musie.play();	              /*自动播放来电音频*/
			$tell.tap(handTell);			// 点击。tell接听 ：1.显示hang接电话 2.显示电话的播放时间
			$hang_up.tap(hangUp);		
		}
	}
})();

//message：消息
let message = (function  () {
	let $ulList = $(".list"),
		$liAll =  $ulList.find("li"),
		$key = $(".key"),
		$p = $key.find(".text"),
		$submit = $key.find(".submit"),
		liLen = $liAll.length;
	//开启定时器自动发送
	let index = -1,
		interval = 1000,
		timer = null;
	    autoInterval = function  autoInterval() {
			++index;
			if(index===2){
				clearInterval(timer);
				mess();
				return;
			}
			$liAll.eq(index).addClass("active");
			if(index>=2){
				let curH =$liAll.get(index).offsetHeight,
				    ulH = parseInt($ulList.css("top"));	
				$ulList.css("top",ulH-curH);
				if(index>=liLen){
					clearInterval(timer);
					close();
				}
			}
		}
	
	//显示键盘、消息
	let mess = function mess () {
		$key.css({transform:"translateY(0rem)"});
		let str = `好的,马上介绍!`,
			strIen = str.length,
			interval = 500,
			index = -1,
			auto = null;
			auto = setInterval(()=>{
				++index;
				let textHtml = $p.html();
				$p.html(textHtml + str[index]);
				if(index>=strIen-1){
					clearInterval(auto);
					$submit.css("display","block");
					return;
				}
			},interval);
	}
	//手动发送
	let handerSend = function  handerSend() {
		let stra = $(`<li class="my">
						<i></i>
						<span class="mm"></span>
						好的，马上介绍！</li>`);
		stra.insertAfter($liAll.eq(1)).addClass("active");
		$liAll = $ulList.find("li"); //由于中途插入节点，所以重新获取li才不会漏掉
		//消息消失
		$p.html("");
		$submit.css("display","none");
		$key.css("transform","translateY(3.7rem)");
		//自动发送消息	
		timer = setInterval(autoInterval,interval);
	}
	
	//li的高度超过，ul向上移
	let close = function close () {
		$(".message").remove();
		cube.init();
	}
	return{
		init:function  () {
			$(".message").css("display","block");
			autoInterval();
			timer = setInterval(autoInterval,interval);
			$submit.tap(handerSend);
		}
	}
})();


let cube = (function  () {
	let $cubeBox = $(".cube"),
		$ulall = $cubeBox.find(".ulall"),
		$liall = $ulall.find("li");
	//开始触屏
	let start = function start (ev) {
		//记录开始触屏时的位置，这里一共有1个手指（共有三个手指），需要取出第一个手指对象
		let point = ev.changedTouches[0];
		this.cliX = point.clientX;
		this.cliY = point.clientY;
		console.dir(point);
	}
	//开始移动
	let move =function move (ev) {
		let point = ev.changedTouches[0];
		this.changeX = point.clientX - this.cliX;
		this.changeY = point.clientY - this.cliY;
	}
	//移动结束
	let end = function end () {
		//横轴方向移动 cliX  =》  rotateY改变 (正比)
		//纵轴方向移动 cliY  =》  rotateX改变 (反比)
		let {changeX,changeY,rotateX,rotateY} = this,
			ismove = false;
		//排除移动误差
		Math.abs(changeX)>10 || Math.abs(changeY) > 10 ? ismove=true : null;
		if(ismove){
			rotateX = rotateX - changeY/3;
			rotateY = rotateY + changeX/3;
			$(this).css("transform",`rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(0.6)`);
			this.rotateX = rotateX;
			this.rotateY = rotateY;
			 ['strX', 'strY', 'changeX', 'changeY'].forEach(item => this[item] = null);
		}
		   
	}
	
	return{
		init:function  () {
			$cubeBox.css("display","block");
			let cube = $ulall[0]; //转换为原生js对象
			
			//rotateX(-18deg ) rotateY(25deg)  scale(0.6)
			cube.rotateX = -18; //记录初始位置
			cube.rotateY = 25;
			$ulall.on("touchstart",start)
			      .on("touchmove",move)
			      .on("touchend",end);
			$liall.tap(function  () {
				$cubeBox.css("display","none");
				let index = $(this).index();
				detail.init(index);
				
			})
		}
	}
})();

let detail = (function  () {
	let $detailBox = $(".detail"),
		$wrapper = $(".swiper-wrapper"),
		$slideDl = $wrapper.find("div>dl"),
		swiper = null;
	let swiperInit = function swiperInit () {
		/*swiper:实现无缝切换的原理：
		 * 		把最后一张克隆放在第一张前面，把第一张克隆放在末尾后面
		 * 实例的私有属性：
		 *  1.activeIndex:当前展示slide的索引
		 *  2.slides：获取所有的slide（数组）
		 *  3.....
		 *实例的公有属性
		 *  1.sildeTo:切换
		 * 
		 */
		swiper = new Swiper(".swiper-container",{
			effect:"coverflow",
			//speed:2000 速度
			onInit:move, //初始化成功执行的回调函数（参数时当前初始化的实例）
			onTransitionEnd:move //动画切换完成后执行的回调函数
		});
	};
	let move = function move (swiper) {
		//判断是否为第一个
		let activeIn = swiper.activeIndex,
			slis = swiper.slides;
		if(activeIn===0){
			//实现折叠效果
			$slideDl.makisu({
				"selector":"dd",
				overlap:0.6,
				speed:0.8
			});
			$slideDl.makisu("open");
		}else{
			$slideDl.makisu({
				selector:"dd",
				overlap:0.6,
				speed:0
			});
			$slideDl.makisu("close");
		}
		slis.each((index,item)=>{
			if(index===activeIn){
				item.id = `page${index+1}`;
				return;
			}
			item.id = null; //非当前页动画需要清除
		})
	}
	return{
		init:function  (index) {
			$detailBox.css("display","block");
			if(!swiper){
				//防止swiper实例的初始化
				swiperInit();
			}
			swiper.slideTo(index);
		}
	}
})()
/*=>开发过程中，由于当前项目有很多板块（每个版块都是一个单例模式），我们最好规划一种机制：通过标识的判断可以让程序执行对应板块内容，
		这样开发哪个板块,我们就把标识改为什么（hash路由控制）
	*/
	let url = window.location.href,
		well = url.indexOf("#"),//找到#的位置，并赋值给well
		val = well===-1? null:url.slice(well+1,);

	switch(val){
		case "loadingRender":
			loadingRender.init();
			break;
		case "listen":
			listen.init();
			break;
		case "message":
			message.init();
			break;
		case "cube":
			cube.init();
			break;
		case "detail":
			detail.init();
			break;
		default:
			loadingRender.init();
	}
		