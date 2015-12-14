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
var JSONResponse;

$(document).ready(function() {
	
	client = new iwc.Client();
	var duration="*";
	var noOfExp = 1;
	
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
			
					$(function() {
						$( "#sortable" ).sortable();
						$( "#sortable" ).disableSelection();
					});
			
					/*$(".reorder-up").click(function(){
						var $current = $(this).closest('li');
						var $previous = $current.prev('li');
						if($previous.length !== 0){
							$current.insertBefore($previous);
						}
						return false;
					});

					$(".reorder-down").click(function(){
						var $current = $(this).closest('li')
						var $next = $current.next('li');
						if($next.length !== 0){
							$current.insertAfter($next);
						}
						return false;
					});*/
					
					getStrategy(localStorage.access_token);
					
					$("#savebtn").click(function(event){
						console.log("access Token: "+localStorage.access_token);
						saveStrategy(localStorage.access_token);
						
					});
				},
				statusCode: {
					401: function() {
						
						document.getElementById("notification").innerHTML = "<span style=\"background:#C90016; float:left; color:#FFF; width:100%; text-align:center;\">You are not logged in!</span>";
						document.getElementById("savebtn").disabled = true;
						
					},
					404: function() {
						
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
	
	
	
	function saveStrategy(access_token){
		
		var strategy = document.getElementById("strategy").value;
		var languageCheck;
		var locationCheck;
		var durationCheck;
		var relevanceCheck;
		var weightOrderCheck;
		
		var order = [];
		
		var idsInOrder = $("#sortable").sortable("toArray");
		
		/*console.log($.inArray("lan", idsInOrder));
		console.log($.inArray("loc", idsInOrder));
		console.log($.inArray("dur", idsInOrder));
		console.log($.inArray("ada", idsInOrder));*/
		
		
		order[$.inArray("lan", idsInOrder)]="L";
		order[$.inArray("loc", idsInOrder)]="O";
		order[$.inArray("dur", idsInOrder)]="D";
		order[$.inArray("rel", idsInOrder)]="R";
		order[$.inArray("wei", idsInOrder)]="W";
		
		var sequence = "";
		
		for(i=0;i<order.length;i++){
			console.log(order[i]);
			sequence += order[i];
		}
		
		/*var index = $.inArray("lan", idsInOrder);
		var index = $.inArray("loc", idsInOrder);
		var index = $.inArray("dur", idsInOrder);
		var index = $.inArray("ada", idsInOrder);*/
		
		
		if(document.getElementById("language").checked==true) languageCheck = 1;
		else languageCheck = 0;
		if(document.getElementById("location").checked==true) locationCheck = 1;
		else locationCheck = 0;
		if(document.getElementById("duration").checked==true) durationCheck = 1;
		else durationCheck = 0;
		if(document.getElementById("relevance").checked==true) relevanceCheck = 1;
		else relevanceCheck = 0;
		if(document.getElementById("weightOrder").checked==true) weightOrderCheck = 1;
		else weightOrderCheck = 0;
		
		$.ajax({
		
			url: "http://eiche.informatik.rwth-aachen.de:7074/adapter/strategy?strategy="+strategy+"&language="+languageCheck+"&location="+locationCheck+"&duration="+durationCheck+"&relevance="+relevanceCheck+"&weightOrder="+weightOrderCheck+"&sequence="+sequence+"&Authorization=Bearer "+access_token,
			type: "POST",
			dataType:'text',
			success: function(value) {
				document.getElementById("savelbl").innerHTML="Preferences successfully saved";
				
				/*var intent = {
					"component":"",
					"sender":"",
					"data":"",
					"dataType":"text/xml",
					"action":"preferenceUpdate",
					"categories":["category1","category2"],
					"flags":["PUBLISH_LOCAL"],
					"extras":{"key1":"val1","key2":2}
				}
				
				if(iwc.util.validateIntent(intent)){
					client.publish(intent);
				}*/
				
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
			}
		}
		
		document.getElementById("sortable").innerHTML = "";
		var newList="";
		for(var i=0; i<sequence.length; i++){
		
			switch (sequence[i]){
				
				case 'L':
					newList += "<li id=\"lan\" class=\"ui-state-default\"><span class=\"ui-icon ui-icon-arrowthick-2-n-s\"></span><div class=\"checkbox inline\" style=\"margin-left: 15%;\"><input id=\"language\" type=\"checkbox\" name=\"language\" value=\"true\"><label for=\"language\">Language</label></div></li>";
					break;
				case 'R':
					newList += "<li id=\"rel\" class=\"ui-state-default\"><span class=\"ui-icon ui-icon-arrowthick-2-n-s\"></span><div class=\"checkbox inline\" style=\"margin-left: 15%;\"><input id=\"relevance\" type=\"checkbox\" name=\"relevance\" value=\"true\"><label for=\"relevance\">Relevance</label></div></li>";
					break;
				case 'D':
					newList += "<li id=\"dur\" class=\"ui-state-default\"><span class=\"ui-icon ui-icon-arrowthick-2-n-s\"></span><div class=\"checkbox inline\" style=\"margin-left: 15%;\"><input id=\"duration\" type=\"checkbox\" name=\"duration\" value=\"true\"><label for=\"duration\">Duration</label></div></li>";
					break;
				case 'O':
					newList += "<li id=\"loc\" class=\"ui-state-default\"><span class=\"ui-icon ui-icon-arrowthick-2-n-s\"></span><div class=\"checkbox inline\" style=\"margin-left: 15%;\"><input id=\"location\" type=\"checkbox\" name=\"location\" value=\"true\"><label for=\"location\">Location</label></div></li>";
					break;
				case 'W':
					newList += "<li id=\"wei\" class=\"ui-state-default\"><span class=\"ui-icon ui-icon-arrowthick-2-n-s\"></span><div class=\"checkbox inline\" style=\"margin-left: 15%;\"><input id=\"weightOrder\" type=\"checkbox\" name=\"weightOrder\" value=\"true\"><label for=\"weightOrder\">Segment Weight</label></div></li>";
					break;
			}
			
		}
		
		document.getElementById("sortable").innerHTML = newList;
		
		
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
	
	
});
