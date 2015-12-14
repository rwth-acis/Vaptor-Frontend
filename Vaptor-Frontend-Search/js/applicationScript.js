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
var messageCounter = 0;
/*var init = function() {
  
	client = new iwc.Client();
	  
	var iwcCallback = function(intent) {
		// define your reactions on incoming iwc events here
		console.log("Search widget: "+intent);
		if (intent.action == "search_intent"){
			console.log("Search widget Inside: "+intent);
		}
	};
	client.connect(iwcCallback);
  
	//client = new Las2peerWidgetLibrary("http://127.0.0.1:7077/userpreferences", iwcCallback);
  
	//gadgets.util.registerOnLoadHandler(init);
  
}*/


// getPreferences
/*var getPreferences = function(){
  var preferences = null;
  var preferences = null;
  client.sendRequest("GET", "127.0.0.1:7077", preferences, "application/json", {}, true,
  function(data, type) {
    console.log(data);
  },
  function(error) {
    console.log(error);
  });
  return preferences;
}*/


$(document).ready(function() {
	//init();	
//	client = new iwc.Client();
	  
	/*var iwcCallback = function(intent) {
		// define your reactions on incoming iwc events here
		//console.log("Search widget: "+intent);
		if (intent.action == "search_intent"){
			console.log("Search widget Inside: "+intent.data);
		}
	};
	client.connect(iwcCallback);*/
	
	
	
	
	console.log("In callback");
	if(localStorage.access_token!=null){
	
	
		function verifyAccessToken(){
			console.log("in verifyAccessToken_search");
			$.ajax({
				url: "https://api.learning-layers.eu/o/oauth2/userinfo",
				type: "GET",
				dataType:'text',
				beforeSend: function(xhr) {
					xhr.setRequestHeader("Authorization", "Bearer "+localStorage.access_token);
				},
				success: function(value) {
					document.getElementById("notification").innerHTML = "";
					document.getElementById("searchbtn").disabled = false;
					var jsonData = JSON.parse(value);
					var verified_username = jsonData.preferred_username.toString();
					console.log("user from search verification: "+verified_username);
					
					$(document).on('change', '#location', function() {
						if(document.getElementById("location").checked){
							document.getElementById("weightOrder").checked = false;
						}
					});
					$(document).on('change', '#weightOrder', function() {
						if(document.getElementById("weightOrder").checked){
							document.getElementById("location").checked = false;
						}
					});
					
					getStrategy(localStorage.access_token);
					
					$("#searchbtn").click(function(event){
					
						messageCounter = 0;
			
						document.getElementById("xmpp_status").innerHTML = "";
						var languageCheck = document.getElementById("language").checked;
						var locationCheck = document.getElementById("location").checked;
						var durationCheck = document.getElementById("duration").checked;
						var relevanceCheck = document.getElementById("relevance").checked;
						var weightOrderCheck = document.getElementById("weightOrder").checked;
						var sequence = $('#checkboxOrder').data('sequence');
						
						valeur = 0;
						$('.progress-bar').css('width', valeur+'%').attr('aria-valuenow', valeur);
						
						var url = document.URL;
						//var access_token = url.substring(url.indexOf('access_token')+13);
						var access_token = localStorage.access_token;
						getLocation();
						var searchString = document.getElementById("searchString").value;
						searchString = searchString.removeStopWords();
						console.log("Stemmed string: "+ searchString);
						//getVideos(document.getElementById("searchString").value, oidc_userinfo["preferred_username"], lat, lng, postGetVideos);
						getVideos(searchString, access_token, lat, lng, languageCheck, locationCheck, durationCheck, relevanceCheck, weightOrderCheck, sequence, getVideosIntent);
						getRelatedSearchIntent(searchString);
						//playVideos();
					});
					
					
					//-----------------------------------------------------------------------
					// XMPP Functions Start
					//-----------------------------------------------------------------------
					
					var valeur;
					
					on_presence = function (presence){
						//console.log("presence");
						return true;
					}

					on_message = function (message){
					
						//console.log("message");
						var bodyTag = message.getElementsByTagName("body");
						console.log("messageCounter: "+messageCounter);
						if(bodyTag[0]){
							if(messageCounter<11){
								document.getElementById("xmpp_status").innerHTML += "<span>"+bodyTag[0].innerHTML+"<br></span>";
								document.getElementById("progress-bar").innerHTML = "<span>"+bodyTag[0].innerHTML+"</span>";
								//document.getElementById("progress-bar").innerHTML="";
								valeur +=9.09090909;
								$('.progress-bar').css('width', valeur+'%').attr('aria-valuenow', valeur);
								//document.getElementById("progress-bar").innerHTML=valueur;
								//console.log(bodyTag[0].innerHTML);
							}
						}
						messageCounter++;
						return true;
					}
					
					xmppAuth_callback = function (status) {
								
						if (status === Strophe.Status.REGISTER) {
							console.log("check");
							// fill out the fields
							connection.register.fields.username = xmpp_user;
							connection.register.fields.password = xmpp_password;
							// calling submit will continue the registration process
							connection.register.submit();
						} else if (status === Strophe.Status.REGISTERED || status === Strophe.Status.CONFLICT) {
							console.log("registered! or already existed");
							
							
							
							connect = new Strophe.Connection(BOSH_SERVICE);
							console.log("xmpp_user: "+xmpp_userdomain);
							connect.connect(xmpp_userdomain, xmpp_password, function (status) {
							   if (status === Strophe.Status.CONNECTED) {
									connect.send($pres());
									console.log("auth pass");
									connect.addHandler(on_presence, null, "presence");
									//addhandler receive messg
									connect.addHandler(on_message, null, null, null);
							   }
							})
						}
						else if (status === Strophe.Status.NOTACCEPTABLE) {
							console.log("Registration form not properly filled out.")
						} else if (status === Strophe.Status.REGIFAIL) {
							console.log("The Server does not support In-Band Registration")
						} else if (status === Strophe.Status.CONNECTED) {
							// do something after successful authentication
							console.log("Connected!");
						} else {
							// Do other stuff
						}
					}
					
					var connection = new Strophe.Connection("http://role-sandbox.eu:5280/http-bind");
				
					var BOSH_SERVICE = 'http://role-sandbox.eu:5280/http-bind';
					//var xmpp_password = oidc_userinfo["preferred_username"]+"password";
					var xmpp_password = verified_username+"password";
					//var xmpp_userdomain = oidc_userinfo["preferred_username"]+"@role-sandbox.eu";
					var xmpp_userdomain = verified_username+"@role-sandbox.eu";
					//var xmpp_user = oidc_userinfo["preferred_username"];
					var xmpp_user = verified_username;
					
					connection.register.connect('role-sandbox.eu', xmppAuth_callback, 20, 10);
					
					//-----------------------------------------------------------------------
					// XMPP Functions end
					//-----------------------------------------------------------------------
					
				},
				statusCode: {
					401: function() {
						//alert("ERROR! Please login again.");
						document.getElementById("notification").innerHTML = "<span style=\"background:#C90016; float:left; color:#FFF; width:100%; text-align:center;\">You are not logged in!</span>";
						document.getElementById("searchbtn").disabled = true;
						
					},
					404: function() {
						//alert("ERROR! Please login again.");
						document.getElementById("notification").innerHTML = "<span style=\"background:#C90016; float:left; color:#FFF; width:100%; text-align:center;\">Something went wrong, please try again!</span>";
						document.getElementById("searchbtn").disabled = true;
					}
					
				},
				error: function(e){console.log(e);}
			});
		}
	
	
		function getStrategy(access_token){
			
			$.ajax({
			
				url: "http://eiche.informatik.rwth-aachen.de:7074/adapter/strategy?Authorization=Bearer "+access_token,
				type: "GET",
				dataType:'text',
				success: function(value) {
					
					JSONResponse = value;
					
					var jsonData = JSON.parse(value);
					var dropbox="<option id=\"*\" value=\"*\" selected>Select</option>";

					for (var i = 0; i < jsonData.length; i++) {
						var strategies = jsonData[i];
						strategy = strategies.strategy.toString();
						
						dropbox += "<option id=\""+strategy+"\" value=\""+strategy+"\">"+strategy+"</option>";
					}
					document.getElementById("availableStratgies").innerHTML=dropbox;
					
					$('#availableStratgies').change(
						function() {
							var strategy = $('#availableStratgies option:selected').val();
							
							getData(strategy);
						}
					);
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
	
		function getData(strategy){
			
			if(strategy== "*"){
				var newList="<div style=\"color:#777\"><h5><span>Filters</span></h5></div>   <div class=\"checkbox inline\"> <input id=\"language\" type=\"checkbox\" name=\"language\" value=\"true\" checked> <label for=\"language\">Language</label> </div>  <div class=\"checkbox inline\"> <input id=\"relevance\" type=\"checkbox\" name=\"relevance\" value=\"true\" checked>  <label for=\"relevance\">Relevance</label> </div>  <div class=\"checkbox inline\"> <input id=\"duration\" type=\"checkbox\" name=\"duration\" value=\"true\" checked>  <label for=\"duration\">Duration</label> </div>  <div style=\"color:#777\"><h5><span>Ordering</span></h5></div>  <div class=\"checkbox inline\"> <input id=\"location\" type=\"checkbox\" name=\"location\" value=\"true\">  <label for=\"location\">Location</label> </div>  <div class=\"checkbox inline\"> <input id=\"weightOrder\" type=\"checkbox\" name=\"weightOrder\" value=\"true\" checked> <label for=\"weightOrder\">Segment Weight</label> </div>";
				
				document.getElementById("checkboxOrder").innerHTML = newList;
			}
			
			else{
				var jsonData = JSON.parse(JSONResponse);

				var language;
				var location;
				var duration;
				var relevance;
				var weightOrder;
				var sequence;

				for (var i = 0; i < jsonData.length; i++) {
					var strategies = jsonData[i];
					
					if(strategy== strategies.strategy.toString()){
						
						language = strategies.language.toString();
						location = strategies.location.toString();
						duration = strategies.duration.toString();
						relevance = strategies.relevance.toString();
						weightOrder = strategies.weightOrder.toString();
						sequence = strategies.sequence.toString();
						$('#checkboxOrder').data('sequence',sequence);
					}
				}
				
				document.getElementById("checkboxOrder").innerHTML = "";
				var newList="";
				for(var i=0; i<sequence.length; i++){
				
					switch (sequence[i]){
						
						case 'L':
							newList += "<div class=\"checkbox inline\"><input id=\"language\" type=\"checkbox\" name=\"language\" value=\"true\"><label for=\"language\">Language</label></div>";
							break;
						case 'R':
							newList += "<div class=\"checkbox inline\"><input id=\"relevance\" type=\"checkbox\" name=\"relevance\" value=\"true\"><label for=\"language\">Relevance</label></div>";
							break;
						case 'D':
							newList += "<div class=\"checkbox inline\"><input id=\"duration\" type=\"checkbox\" name=\"duration\" value=\"true\"><label for=\"language\">Duration</label></div>";
							break;
						case 'O':
							newList += "<div class=\"checkbox inline\"><input id=\"location\" type=\"checkbox\" name=\"location\" value=\"true\"><label for=\"language\">Location</label></div>";
							break;
						case 'W':
							newList += "<div class=\"checkbox inline\"><input id=\"weightOrder\" type=\"checkbox\" name=\"weightOrder\" value=\"true\"><label for=\"language\">Segment Weight</label></div>";
							break;
					}
					
				}
				
				document.getElementById("checkboxOrder").innerHTML = newList;
				
				
				if(language == 0) $('#language').prop('checked', false);
				else $('#language').prop('checked', true);
				
				if(location == 0) $('#location').prop('checked', false);
				else $('#location').prop('checked', true);
				
				if(duration == 0) $('#duration').prop('checked', false);
				else $('#duration').prop('checked', true);
				
				if(relevance == 0) $('#relevance').prop('checked', false);
				else $('#relevance').prop('checked', true);
				
				if(weightOrder == 0) $('#weightOrder').prop('checked', false);
				else $('#weightOrder').prop('checked', true);
			
			}
		}
		
		//-----------------------------------------------------------------------
		// Location Functions Start
		//-----------------------------------------------------------------------
		
		var lat, lng;
		
		function getLocation() {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(showPosition);
			} else { 
				lat = "*";
				lng = "*";
				//x.innerHTML = "Geolocation is not supported by this browser.";
			}
		}

		function showPosition(position) {
		
			lat = position.coords.latitude;
			lng = position.coords.longitude;
			console.log(lat);
			//x.innerHTML = "Latitude: " + position.coords.latitude + 
			//"<br>Longitude: " + position.coords.longitude;	
		}
		
		//-----------------------------------------------------------------------
		// Location Functions End
		//-----------------------------------------------------------------------
		
		
		function getVideos(searchString, access_token, lat, lng, languageCheck, locationCheck, durationCheck, relevanceCheck, weightOrderCheck, sequence, getVideosIntent){
		
			if(window.mobilecheck()){
				//var uri = "http://eiche.informatik.rwth-aachen.de:7074/adapter/getPlaylist?sub=123&search="+searchString+"&username="+username+"&lat="+lat+"&lng="+lng+"&mobile="+window.mobilecheck();
				var uri = "http://eiche.informatik.rwth-aachen.de:7074/adapter/playlist?sub=123&search="+searchString+"&Authorization=Bearer "+access_token+"&lat="+lat+"&lng="+lng+"&mobile="+window.mobilecheck()+"&language="+languageCheck+"&location="+locationCheck+"&duration="+durationCheck+"&relevance="+relevanceCheck+"&weightOrder="+weightOrderCheck+"&sequence="+sequence;
			}
			else{
				//var uri = "http://eiche.informatik.rwth-aachen.de:7074/adapter/getPlaylist?sub=123&search="+searchString+"&username="+username+"&lat="+lat+"&lng="+lng;
				var uri = "http://eiche.informatik.rwth-aachen.de:7074/adapter/playlist?sub=123&search="+searchString+"&Authorization=Bearer "+access_token+"&lat="+lat+"&lng="+lng+"&language="+languageCheck+"&location="+locationCheck+"&duration="+durationCheck+"&relevance="+relevanceCheck+"&weightOrder="+weightOrderCheck+"&sequence="+sequence;
			}
			
			$.ajax({
				//url: "http://eiche.informatik.rwth-aachen.de:7074/adapter/getPlaylist?sub=123&search="+searchString+
				//"&username="+username+"&lat="+lat+"&lng="+lng,
				url: uri,
				type: "GET",
				dataType:'text',
				//beforeSend: function(xhr) {
	            //xhr.setRequestHeader("Authorization", "Bearer "+access_token);
				//},
				//success: postGetVideos,
				success: getVideosIntent,
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
		
		function getVideosIntent(value){
		
			if(value!="No Annotation"){
				document.getElementById("notification").innerHTML = "";

				client = new iwc.Client();
				console.log("Search widget: inside getVideosIntent");

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
			else{
				document.getElementById("progress-bar").innerHTML = "<span>No results found!</span>";
			}
		}
		
		function getRelatedSearchIntent(value){
		
			//document.getElementById("notification").innerHTML = "";

			client = new iwc.Client();
			console.log("Search widget: inside getRelatedSearchIntent");

			var intent = {
				"component":"",
				"sender":"",
				"data":value,
				"dataType":"text/xml",
				"action":"getRelatedSearch",
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
		console.log("not signed in...");
		console.log(result);
		$("#status").html("Do I know you?!");
	}
  
});
