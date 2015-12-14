/*
 * Copyright (c) 2015 Advanced Community Information Systems (ACIS) Group, Chair
 * of Computer Science 5 (Databases & Information Systems), RWTH Aachen
 * University, Germany All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 * 
 * Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 * 
 * Neither the name of the ACIS Group nor the names of its contributors may be
 * used to endorse or promote products derived from this software without
 * specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

var client;

$(document).ready(function() {
	//init();	
	client = new iwc.Client();
	  
	var iwcCallback = function(intent) {
		// define your reactions on incoming iwc events here
		if (intent.action == "getRelatedSearch"){
			//console.log("Recommendation widget Inside: "+intent.data);
			getRelatedSearch(localStorage.access_token, intent.data, postGetRecommendations);
			//postGetRecommendations(intent.data);
		}
		
	};
	client.connect(iwcCallback);
	
	////console.log("In callback Recommendation widget");
	
	if(localStorage.access_token!=null){
		
		function verifyAccessToken(){
			$.ajax({
				url: "https://api.learning-layers.eu/o/oauth2/userinfo",
				type: "GET",
				dataType:'text',
				beforeSend: function(xhr) {
					xhr.setRequestHeader("Authorization", "Bearer "+localStorage.access_token);
				},
				success: function(value) {
					document.getElementById("notification").innerHTML = "";
					var jsonData = JSON.parse(value);
					username = jsonData.preferred_username.toString();
					//console.log("user from verification: "+username);
					getRecommendations(localStorage.access_token, postGetRecommendations);
				},
				statusCode: {
					401: function() {
						document.getElementById("notification").innerHTML = "<span style=\"background:#C90016; float:left; color:#FFF; width:100%; text-align:center;\">You are not logged in!</span>";
						
					},
					404: function() {
						document.getElementById("notification").innerHTML = "<span style=\"background:#C90016; float:left; color:#FFF; width:100%; text-align:center;\">Something went wrong, please try again!</span>";
						
					}
					
				},
				error: function(e){console.log(e);}
			});
		}
		
		
		function getRecommendations(access_token, postGetRecommendations){
			if(window.mobilecheck()){
				var uri = "http://eiche.informatik.rwth-aachen.de:7078/recommendation?Authorization=Bearer "+access_token+"&mobile="+window.mobilecheck();
			}
			else{
				var uri = "http://eiche.informatik.rwth-aachen.de:7078/recommendation?Authorization=Bearer "+access_token;
			}

			$.ajax({
				url: uri,
				type: "GET",
				dataType:'text',
				success: postGetRecommendations,
				statusCode: {
					401: function() {
						document.getElementById("notification").innerHTML = "<span style=\"background:#C90016; float:left; color:#FFF; width:100%; text-align:center;\">You are not logged in!</span>";
					},
					404: function() {
						document.getElementById("notification").innerHTML = "<span style=\"background:#C90016; float:left; color:#FFF; width:100%; text-align:center;\">Something went wrong, please try again!</span>";
					}
					
				},
				error: function(e){console.log(e);}
			});


		}
		
		function getRelatedSearch(access_token, searchString, postGetRecommendations){
			//if(window.mobilecheck()){
				var uri = "http://eiche.informatik.rwth-aachen.de:7078/recommendation/relatedSearch?Authorization=Bearer "+access_token+"&search="+searchString;
				//var uri = "http://eiche.informatik.rwth-aachen.de:7078/recommendation?Authorization=Bearer "+access_token+"&mobile="+window.mobilecheck();
			/*}
			else{
				var uri = "http://eiche.informatik.rwth-aachen.de:7078/recommendation?Authorization=Bearer "+access_token;
			}*/

			$.ajax({
				url: uri,
				type: "GET",
				dataType:'text',
				success: postGetRecommendations,
				statusCode: {
					401: function() {
						//alert("ERROR! Please login again.");
						document.getElementById("notification").innerHTML = "<span style=\"background:#C90016; float:left; color:#FFF; width:100%; text-align:center;\">You are not logged in!</span>";
					},
					404: function() {
						//alert("ERROR! Please login again.");
						document.getElementById("notification").innerHTML = "<span style=\"background:#C90016; float:left; color:#FFF; width:100%; text-align:center;\">Something went wrong, please try again!</span>";
					}
					
				},
				error: function(e){console.log(e);}
			});


		}
		

		function postGetRecommendations(value){
		
			if(value!==undefined && value!=="No Annotation" && value!=="No Annotations found!"){
				document.getElementById("recommendation").innerHTML = "";
				document.getElementById("notification").innerHTML = "";
				var jsonData = JSON.parse(value);
				
				for (var i = 0; i < jsonData.length; i=i+2) {
					var recommendationsTitle = jsonData[i];
					var recommendations = jsonData[i+1];
					//console.log("String recommendations: "+recommendations.toString());

					document.getElementById("recommendation").innerHTML += "<a href=\"#\" class=\"list-group-item\"><span class=\"recommendspan\" data-info='"+recommendations+"'>"+recommendationsTitle+"</span></a>"
				}
				$(".list-group-item").click(function(event){

					//console.log("data value: "+$(this).find('.recommendspan').attr('data-info'));
					getVideosIntent($(this).find('.recommendspan').attr('data-info'));
					//playVideos();

				});
			}
		}
		
		function getVideosIntent(value){

			client = new iwc.Client();
			//console.log("Search widget: inside getVideosIntent");

			var intent = {
				"component":"",
				"sender":"",
				"data":value,
				"dataType":"text/xml",
				"action":"getVideos",
				"categories":["category1","category2"],
				"flags":["PUBLISH_LOCAL"],
				"extras":{"key1":"val1","key2":2}
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
		
		verifyAccessToken();
		
		
		
		
	} else {
		//console.log("not signed in...");
		//console.log(result);
		$("#status").html("Do I know you?!");
	}
  
});
