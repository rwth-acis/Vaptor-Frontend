/**
 * A classy way to play HTML5 videos on a loop without gaps
 * @author LifeMirror http://www.lifemirror.org/
 * @constructor
 */

 /**
 * @param playlist An array of URLs to be played - see documentation for details
 * @param container The HTML ID of the element to insert videos into
 * @param baseurl The base URL to append to videos
 * @param options A list of additional <video> options, if any
 */
 function LifemirrorPlayer(){}
 
 LifemirrorPlayer.prototype.init = function(playlist, latList, lngList, timeList, durationList, annotationlist, annotationTextList, edgeList, weightList, annotationIdList, annotationKeywordList, container, baseurl, options) {

	this.playlist   = playlist;
    this.container  = container;
    this.baseurl    = baseurl;
    this.options    = options;
    this.preloaded  = 0;
	this.annotationlist = annotationlist;
	this.annotationTextList = annotationTextList;
	this.annotationIdList = annotationIdList;
	this.annotationKeywordList = annotationKeywordList;
	this.timeList = timeList;
	this.durationList = durationList;
	this.latList = latList;
	this.lngList = lngList;
	this.edgeList = edgeList;
	this.weightList = weightList;
	
	
	/*this.marker0 = google.maps.event.createMarker({
			position: new google.maps.LatLng(33.808678, -117.918921),
			map: map,
			icon: "http://1.bp.blogspot.com/_GZzKwf6g1o8/S6xwK6CSghI/AAAAAAAAA98/_iA3r4Ehclk/s1600/marker-green.png"
			}, "<h1>Marker 0</h1><p>This is the home marker.</p>");*/

	
	//marker = new google.maps.Marker( {position: myLatLng, map: map} );
	
}


var lifemirror;
var playingNow;


LifemirrorPlayer.prototype.preloadVideos = function() {
    for(var index=0;index<this.playlist.length;index++) {
        // Prepare HTML to insert
        // This is necessary to prevent the browser closing tags
        var htmlToInsert = "<video controls height='55%' preload oncanplaythrough='lifemirror.preloaderCallback()' onpause='lifemirror.videoCallback(\""+this.playlist[index]+"\")' id='"+ this.playlist[index]+"' style='display:none; margin-bottom:2%;' "+this.options+">";
        //htmlToInsert += "<source src='"+Lifemirror.baseurl+Lifemirror.playlist[index]+"/video.mp4' type='video/mp4'>";
        //htmlToInsert += "<source src='"+Lifemirror.baseurl+Lifemirror.playlist[index]+"/video.ogg' type='video/ogg'>";
		htmlToInsert += "<source src='"+this.playlist[index]+"' type='video/mp4'>";
        //htmlToInsert += "<source src='"+Lifemirror.playlist[index]+"' type='video/ogg'>";
        htmlToInsert += "</video><div id=\""+index+"\" style=\"display:none;\" ><button class=\"btn btn-default btn-block backbtn\" data-info ='"+index+"' style=' float:left; width:25%; display:block;'>Previous</button>";
		htmlToInsert += "<button class=\"btn btn-default btn-block nextbtn\" data-info ='"+index+"' style=' float:right; width:25%; display:block;'>Next </button></div>";
		htmlToInsert +="<div id ='"+this.annotationIdList[index]+"' data-info= '"+annotationKeywordList[index]+"' style='display:none; font-size:18px; text-align:center; margin-top: 8%;'>";
		var idSplit = this.annotationKeywordList[index].split(" ");
		
		for(i=0;i<idSplit.length;i++){
			htmlToInsert += "<span style='margin-right: 3%;' class=\"label label-info\">"+idSplit[i]+" </span>";
		}
		
		//htmlToInsert += "<br>";
		htmlToInsert +="<input type=\"textbox\" style='width:50%; display:block; margin-top:2%;' class=\"form-control new-tag\" placeholder=\"Enter new tag here...\">";
		htmlToInsert +="<button type=\"button\" style='width:50%; display:block;' class=\"btn btn-default btn-block add-tag\">Add</button>";
		htmlToInsert +="</div>";

		var url = this.playlist[index];
		var filename = url.substring(url.lastIndexOf('/')+1);
		filename = filename.substr(0, filename.indexOf('#')); 
		//console.log("FILENAME: "+filename);
		var num = +this.durationList[index] + +this.timeList[index];
		
		//var videoCaption = "<span id='"+ this.timeList[index]+"' style='display:none'>Showing "+filename+" from "+ this.timeList[index]+" secs to " +num+" secs. </span>"
		
		var fromMinutes = pad2(Math.floor(this.timeList[index] / 60));
		var fromSeconds = pad2(this.timeList[index] - fromMinutes * 60);
		
		var toMinutes = pad2(Math.floor(num / 60));
		var toSeconds = pad2(num - toMinutes * 60);
		
		var videoCaption = "<span id='"+ this.timeList[index]+"' style='display:none; font-size:18px;'>";
		videoCaption += "<span >"+filename+"  </span>";
		videoCaption += "<span class=\"label label-info\">"+fromMinutes+":"+fromSeconds+" </span>";
		videoCaption += "<span>&nbsp;   -   </span>";
		videoCaption += "<span class=\"label label-info\">"+toMinutes+":"+toSeconds+" </span>";
		videoCaption += "</span>";
		
		
		
        // Insert the HTML
		document.getElementById("videonamedisplay").innerHTML += videoCaption;
        document.getElementById("videodisplay").innerHTML += htmlToInsert;
		//document.getElementById("annotationdisplay").innerHTML +=  annotationHtmlToInsert;
		//document.getElementById("star_rating").innerHTML +=  star_ratingHtmlToInsert;
		
		/*if((index+1)>=this.playlist.length){
				
			console.debug("INDEX: "+index);
			console.debug("LENGTH: "+this.playlist.length);
			document.getElementById("annotationdisplay").innerHTML += "<span class=\"list-group-item active\" id='end' style='display:block; line-height:30px;'> End of Adaptive Video </span>";
		}*/
		
    }
	
	$(".add-tag").click(function(event){
		var parent = $(this).parent();
		var annotationId = parent.attr("id");
		var oldTags = parent.attr("data-info");
		var newTag = parent.find('.new-tag').val();
		//console.log("annotationId: "+annotationId+" Tag Value: "+newTag+" Old Tags: "+oldTags);
		
		//setTag(oldTags+" "+newTag, annotationId);
		var tags=oldTags+" "+newTag;
		
		$.ajax({

			url: "http://eiche.informatik.rwth-aachen.de:7073/annotations/objects/"+annotationId,
			type: "PUT",
			//dataType:'application/json',
			contentType: "application/json",
			data: "{\"keywords\":"+ tags+"}",
			success: function(value) {
				$("<span style='margin-right: 2%;' class=\"label label-info\">"+newTag+" </span>" ).prependTo(parent);
				parent.find('.new-tag').val("");
				//console.log("Tags updated: "+newTag);
			},
			statusCode: {
				401: function() {
					alert("ERROR! Please login again.");
				},
				404: function() {
					alert("ERROR! Please login again.");
				}
				
			},
			error: function(e){console.log(e);}
		});
		
		
	});
	
	$(".nextbtn").click(function(event){
		
		var nextIndex = $(this).attr("data-info");
		lifemirror.getNext(nextIndex);
	});
	
	$(".backbtn").click(function(event){
		
		var prevIndex = $(this).attr("data-info");
		lifemirror.getPrevious(prevIndex);
	});
	
	
}

LifemirrorPlayer.prototype.getPrevious = function(prevIndex) {

	////console.log("Next Index: "+nextIndex+" Length: "+this.playlist.length);
	var intIndex = parseInt(prevIndex);
	intIndex-=1;
	if(intIndex >= 0){
		
		////console.log("next btn: "+this.playlist[intIndex]);
		
		var intent = {
		"component":"",
		"sender":"",
		"data":this.playlist[intIndex],
		"dataType":"text/xml",
		"action":"onNextClick",
		"categories":["category1","category2"],
		"flags":["PUBLISH_LOCAL"],
		"extras":{"a":"a"}
		}
					
		if(iwc.util.validateIntent(intent)){
			client.publish(intent);
		}
		
		this.playVideo(this.playlist[intIndex]);
	}
	
	
}


LifemirrorPlayer.prototype.getNext = function(nextIndex) {

	//console.log("Next Index: "+nextIndex+" Length: "+this.playlist.length);
	var intIndex = parseInt(nextIndex);
	intIndex+=1;
	if(intIndex < this.playlist.length){
		
		//console.log("next btn: "+this.playlist[intIndex]);
		
		var intent = {
		"component":"",
		"sender":"",
		"data":this.playlist[intIndex],
		"dataType":"text/xml",
		"action":"onNextClick",
		"categories":["category1","category2"],
		"flags":["PUBLISH_LOCAL"],
		"extras":{"a":"a"}
		}
					
		if(iwc.util.validateIntent(intent)){
			client.publish(intent);
		}
		
		this.playVideo(this.playlist[intIndex]);
	}
	
	
}

LifemirrorPlayer.prototype.startPlaying = function() {
    var object = document.getElementById(this.playlist[0]);
	// //var annObject = document.getElementById(this.annotationlist[0]);
	var name = document.getElementById(this.timeList[0]);
	var keywords = document.getElementById(this.annotationIdList[0]);
	var next = document.getElementById(0);
	updateMap(this.latList[0],this.lngList[0]);
    
	if(object!=null){
		object.style.display = 'inline';
		name.style.display = 'inline';
		keywords.style.display = 'block';
		next.style.display = 'inline';
	}
	//annObject.style.display = 'inline';
	// //annObject.style.backgroundColor = '#5BC0DE';
	// //annObject.style.color = '#333';
	playingNow = this.playlist[0];
    //object.play();
}

function clicked(item) {
    alert($(item).attr("id"));
	lifemirror.videoCallback($(item).attr("id"));
}


   
   
LifemirrorPlayer.prototype.playVideo = function(id) {
	
	document.getElementById(playingNow).pause();
	var index = this.playlist.indexOf(playingNow);
	// Hide current object
	document.getElementById(playingNow).style.display = 'none';
	document.getElementById(this.timeList[index]).style.display = 'none';
	document.getElementById(this.annotationIdList[index]).style.display = 'none';
	document.getElementById(index).style.display = 'none';

	// Get the next object in array
	index = this.playlist.indexOf(id);
	
	// Show next video
	var object = document.getElementById(this.playlist[index]);
	var name = document.getElementById(this.timeList[index]);
	var keywords = document.getElementById(this.annotationIdList[index]);
	var next = document.getElementById(index);
	//console.log("Index before inline: "+next);
	
	//google.maps.event.moveMarker(map, marker0,50.75968 , 6.0965247);
	updateMap(this.latList[index],this.lngList[index]);
	//moveMarker(map, marker, 50, 7);
	
	//if(index < Lifemirror.playlist.length){
	if(object!=null){
		object.style.display = 'inline';
		name.style.display = 'inline';
		keywords.style.display = 'block';
		next.style.display = 'inline';
	}
		//annobject.style.display = 'inline';
		// //annObject.style.backgroundColor = '#5BC0DE';
		// //annObject.style.color = '#333';
		playingNow = id;
		
		var pausetime = document.getElementById(id).currentTime;
		var end_time = id.match(/,(.*)/);
		
		if(pausetime<end_time[1]) {
			object.play();
		}
}
   
   
   

LifemirrorPlayer.prototype.videoCallback = function(id) {
	
    if(document.getElementById(id)!=null){
		var pausetime = document.getElementById(id).currentTime;
		//console.log(pausetime);
		var start_time = id.match(/#t=(.*),/);
		var end_time = id.match(/,(.*)/);
		//alert (start_time[1]+","+end_time[1]);
		
		sendIntent("onPause", id, pausetime);
		
		if(pausetime>=end_time[1]) {
			
			var index = this.playlist.indexOf(id);
			console.debug("pausetime>=19");
			//console.debug("INDEX: "+index);
			//console.debug("LENGTH: "+this.playlist.length);
			if(index+1 < this.playlist.length){
				// Hide current object
				document.getElementById(id).style.display = 'none';
				document.getElementById(this.timeList[index]).style.display = 'none';
				document.getElementById(this.annotationIdList[index]).style.display = 'none';
				document.getElementById(index).style.display = 'none';
				
				// Find next object in array
				index += 1;
				
				
				// hide the previous annotation
				//document.getElementById(Lifemirror.annotationlist[index-1]).style.display = 'none';
				// //document.getElementById(this.annotationlist[index-1]).style.backgroundColor = 'transparent';
				//document.getElementById(this.annotationlist[index-1]).style.color = '#FFFFFF';
				//index = 0;

				// Show next video
				var object = document.getElementById(this.playlist[index]);
				// //var annObject = document.getElementById(this.annotationlist[index]);
				var name = document.getElementById(this.timeList[index]);
				var keywords = document.getElementById(this.annotationIdList[index]);
				var next = document.getElementById(index);
				//google.maps.event.moveMarker(map, marker0,50.75968 , 6.0965247);
				updateMap(this.latList[index],this.lngList[index]);
				//moveMarker(map, marker, 50, 7);
				
				//if(index < Lifemirror.playlist.length){
				if(object!=null){
					object.style.display = 'inline';
					name.style.display = 'inline';
					keywords.style.display = 'block';
					next.style.display = 'inline';
				}
					//annobject.style.display = 'inline';
					// //annObject.style.backgroundColor = '#5BC0DE';
					// //annObject.style.color = '#333';
					playingNow = this.playlist[index];
					object.play();
				//}
			}
			else{
				// //var annObject = document.getElementById(this.annotationlist[index]);
				// //annObject.style.backgroundColor = 'transparent';
				// //annObject.style.color = '#FFFFFF'
				
				// //document.getElementById("end").style.backgroundColor = '#5BC0DE';
			
			}
		}
	}
}

LifemirrorPlayer.prototype.preloaderCallback = function() {
    this.preloaded++;
    if(this.preloaded == this.playlist.length) this.startPlaying();
}




lifemirror = new LifemirrorPlayer();


var videoplaylist = [];
var annotationlist = [];
var annotationTextList = [];
var timeList = [];
var durationList = [];
var latList = [];
var lngList = [];
var edgeList = [];
var weightList = [];

function flushLists(){


	//.length = 0
	videoplaylist = [];
	annotationlist = [];
	annotationTextList = [];
	timeList = [];
	durationList = [];
	latList = [];
	lngList = [];
	edgeList = [];
	weightList = [];
	annotationKeywordList = [];
	annotationIdList = [];
}


function postGetVideos(value){

	//console.log(value);
					
	var jsonData = JSON.parse(value);

	for (var i = 0; i < jsonData.length; i++) {
		var videos = jsonData[i];
		var videoUri = videos.videoURL.toString();
		var title = videos.title.toString();
		var text = videos.text.toString();
		var time = videos.time.toString();
		var duration = videos.duration.toString();
		var latitude = videos.Latitude.toString();
		var longitude = videos.Longitude.toString();
		var edge = videos.edgeId.toString();
		var weight = videos.weight.toString();
		var annotationKeyword = videos.keywords.toString();
		var annotationId = videos.id.toString();
		videoplaylist.push(videoUri);
		annotationlist.push(title);
		annotationTextList.push(text);
		timeList.push(time);
		durationList.push(duration);
		latList.push(latitude);
		lngList.push(longitude);
		edgeList.push(edge);
		weightList.push(weight);
		annotationKeywordList.push(annotationKeyword);
		annotationIdList.push(annotationId);
	}
	
	
	
	//console.log(annotationlist[0]);
	/*$('html,body').animate({
	scrollTop: $("#annotationdisplay").offset().top},'slow');*/
	playVideos();
	//$(function(){
	var $select = $(".1-n");
	for (i=1;i<=jsonData.length;i++){
		$select.append($('<option></option>').val(i).html(i))
	}
	//});
}

function playVideos(){

	var base = "random";
	var options = "";
	
	lifemirror.init(videoplaylist, latList, lngList, timeList, durationList, annotationlist, annotationTextList, edgeList, weightList, annotationIdList, annotationKeywordList, "videodisplay", base, options);
	
	lifemirror.preloadVideos();
	lifemirror.startPlaying();
}



function updateMap(lt,ln) {
    
	var intent = {
		"component":"",
		"sender":"",
		"data":"dummy",
		"dataType":"text/xml",
		"action":"updateMap",
		"categories":["category1","category2"],
		"flags":["PUBLISH_LOCAL"],
		"extras":{"lat":lt,"lon":ln}
	}
				
	if(iwc.util.validateIntent(intent)){
		client.publish(intent);
	}
}

window.mobilecheck = function() {
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
}

function sendIntent(action, data, pauseTime){

	//client = new iwc.Client();
	//console.log("player widget: inside sendIntent");

	var intent = {
		"component":"",
		"sender":"",
		"data":data,
		"dataType":"text/xml",
		"action":action,
		"categories":["category1","category2"],
		"flags":["PUBLISH_LOCAL"],
		"extras":{"pauseTime":pauseTime}
	}
				
	if(iwc.util.validateIntent(intent)){
		client.publish(intent);
	}
}

function pad2(number) {
   
     return (number < 10 ? '0' : '') + number
   
}

function pad2(number) {
   
     return (number < 10 ? '0' : '') + number
   
}



