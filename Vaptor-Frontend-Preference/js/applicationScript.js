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
			
					$("#savebtn").click(function(event){
						console.log("access Token: "+localStorage.access_token);
						updateUserProfile(localStorage.access_token);
						
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
	
	
	$('.clockpicker').clockpicker().find('input').change(function(){
		duration=this.value;
	});
	var input = $('#single-input').clockpicker({
		placement: 'bottom',
		align: 'left',
		autoclose: true,
		'default': 'now'
	});


	var max_fields      = 10; //maximum input boxes allowed
	var wrapper_exp         = $(".exp_fields_wrap"); //Fields wrapper
	var wrapper_lvl         = $(".lvl_fields_wrap"); //Fields wrapper
	var add_button      = $(".add_field_button"); //Add button ID
	
	//var x = 2; //initial text box count
	$(add_button).click(function(e){ //on add input button click
		console.log("add button clicked");
		e.preventDefault();
		if(noOfExp < max_fields){ //max input box allowed
			
			noOfExp++; //text box increment
			$(wrapper_exp).append('<div id="domain_' + noOfExp +'" class = "bottom_space row wide75"> <span>Domain of expertise</span> <form action="#"> <select class="form-control" id="exp' + noOfExp +'"> <option id="*" value="*" selected>Select</option> <option id="co" value="co">Construction</option> <option id="he"  value="he">Health</option> <option id="ed" value="ed">Education</option> </select> </form> </div>');
		
			$(wrapper_lvl).append('<div id="lvl_domain_'+ noOfExp +'" class = "bottom_space row wide75"> <span>Level of expertise</span> <form action="#"> <select class="form-control" id="lvl' + noOfExp +'"> <option id="*" value="*" selected>Select</option> <option id="no" value="0.25">Novice</option> <option id="in" value="0.5">Intermediate</option> <option id="ex" value="0.75">Expert</option> </select> </form> <a href="#" class="remove_field">Remove</a></div>');
			
		
		}
	});
	
	$(wrapper_exp).on("click",".remove_field", function(e){ //user click on remove text
		e.preventDefault(); 
		
		var name = $(this).parent('div').attr('id');
		$("#"+name).remove();
		$("#lvl_"+name).remove();
		//$(this).parent('div').remove(); 
		noOfExp--;
		
	});
	
	
	function updateUserProfile(access_token){

		var lang = document.getElementById("language").value;
		var location = document.getElementById("location").value;
		
		if(location=="") location = "*";
		var jsonpreferences = '{"Authorization":"Bearer '+access_token+'","language":"'+lang+'","location":"'+location+'","duration":"'+duration+'"';
		
		for(loop=0;loop<noOfExp;loop++){
		
			var exp= document.getElementById("exp"+(loop+1));
			var lvl= document.getElementById("lvl"+(loop+1));
			
			jsonpreferences += ',"exp'+(loop+1)+'":"'+exp.value+'","lvl'+(loop+1)+'":"'+lvl.value+'"';
		}
		jsonpreferences +=',"noOfExp":"'+noOfExp+'"}';
		
		$.ajax({
		
		url: "http://eiche.informatik.rwth-aachen.de:7077/preference",
			type: "POST",
			dataType:'text',
			data: jsonpreferences,
			success: function(value) {
				document.getElementById("savelbl").innerHTML="Preferences successfully saved";
				
				var intent = {
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
