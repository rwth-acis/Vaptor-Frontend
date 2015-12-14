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


var init = function() {
		
	console.log("init function UserPreferences");
	client = new iwc.Client();
	/*var iwcCallback = function(intent) {
		// define your reactions on incoming iwc events here
		console.log(intent);
	};*/
  
	//client = new Las2peerWidgetLibrary("http://127.0.0.1:7077/userpreferences", iwcCallback);
  

	/*$('#input123').on('click', function() {
		getPreferences();
	})*/
}


$(document).ready(function() {
	
	client = new iwc.Client();
	  
	var iwcCallback = function(intent) {
		// define your reactions on incoming iwc events here
		
		if (intent.action == "preferenceUpdate"){
			
			document.getElementById("domain").innerHTML="";
			
			getUserProfile(localStorage.access_token);
			getUserExpertise(localStorage.access_token, "he");
			getUserExpertise(localStorage.access_token, "ed");
			getUserExpertise(localStorage.access_token, "co");
			
		}
	};
	client.connect(iwcCallback);
	
	
	console.log("In callback");
	if(localStorage.access_token!=null){
	
		console.log("callback Success");
		
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
					getUserProfile(localStorage.access_token);
					getUserExpertise(localStorage.access_token, "he");
					getUserExpertise(localStorage.access_token, "ed");
					getUserExpertise(localStorage.access_token, "co");
				},
				statusCode: {
					401: function() {
						//alert("ERROR! Please login again.");
						document.getElementById("notification").innerHTML = "<span style=\"background:#C90016; float:left; color:#FFF; width:100%; text-align:center;\">You are not logged in!</span>";
						document.getElementById("savebtn").disabled = true;
						
					},
					404: function() {
						//alert("ERROR! Please login again.");
						document.getElementById("notification").innerHTML = "<span style=\"background:#C90016; float:left; color:#FFF; width:100%; text-align:center;\">Something went wrong, please try again!</span>";
						document.getElementById("savebtn").disabled = true;
					}
					
				},
				error: function(e){console.log(e);}
			});
		}
		
		verifyAccessToken();

	} else {
		console.log("not signed in...");
		console.log(result);
		$("#status").html("Do I know you?!");
	}
	
	
	
	function getUserProfile(access_token){
		
		$.ajax({
		
			url: "http://eiche.informatik.rwth-aachen.de:7077/preference?Authorization=Bearer "+access_token,
			type: "GET",
			dataType:'text',
			success: function(value) {
				console.log("show pref success");
				var preferences = JSON.parse(value);
				var language = preferences.language.toString();
				var duration = preferences.duration.toString();
				var location = preferences.location.toString();
				
				console.log("language: "+language+" duration: "+duration+" location: "+location);
				
				if(language!=null){
					switch (language){
						case "en":
							language = "English";
							break;
						
						case "de":
							language = "Deutsch";
							break;
						
						case "es":
							language = "Espa&ntilde;ol";
							break;
					}
					document.getElementById("lan").innerHTML=language;
				}
				else{
					document.getElementById("lan").innerHTML="-"
				}
				
				if(duration!=null){
					document.getElementById("dur").innerHTML=duration;
				}
				else{
					document.getElementById("dur").innerHTML="-"
				}
				
				if(location!=null){
					document.getElementById("loc").innerHTML=location;
				}
				else{
					document.getElementById("loc").innerHTML="-"
				}
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
	
	
	function getUserExpertise(access_token, domain){
		
		$.ajax({
		
			url: "http://eiche.informatik.rwth-aachen.de:7077/preference/expertise?Authorization=Bearer "+access_token+"&domain="+domain,
			type: "GET",
			dataType:'text',
			success: function(value) {
				
				var level;
				if(value!=0){
					
					if(domain=="he"){
						domain="Health";
					}
					if(domain=="ed"){
						domain="Education";
					}
					if(domain=="co"){
						domain="Construction";
					}
					
					if(value==0.25){
						level="Novice";
					}
					if(value==0.5){
						level="Intermediate";
					}
					if(value==0.75){
						level="Expert";
					}
					
					var newElement = document.createElement('div');
					newElement.style.cssText = 'margin-top:6%;';
					newElement.innerHTML = "<span>"+domain+" </span> <span class=\"label label-info\">"+level+"</span>";
					document.getElementById("domain").appendChild(newElement);
		
				}
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
	
  
});
