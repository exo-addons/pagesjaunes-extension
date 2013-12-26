$(document).ready(function() {
	var hpRandomNumber = Math.floor(Math.random()*1000000)
	var hpStatHtml = "<img alt='' src='http://logc258.at.pagesjaunes.fr/hit.xiti?s=540649&p=HP_PJ&rn=" + hpRandomNumber + "'>";
	$("#searchForm").append(hpStatHtml);
	var xtkey=false;
	if(document.addEventListener){
		document.addEventListener('keydown',function(){xtkey=true},false);
		document.addEventListener('keyup',function(){xtkey=false},false);
	}
	else if(document.attachEvent){
		document.attachEvent('onkeydown',function(){xtkey=true});
		document.attachEvent('onkeyup',function(){xtkey=false});
	}
});

$(document).keypress(function(event) {
	var keycode = (event.keyCode ? event.keyCode : event.which);
	if(keycode == "13"){
		updateSearchResults();
		return xt_click(this,'C','','Trouver::Trouver_HP','A');
	}
});

function addTopic(merchantName, merchantUrl, i) {
	var html = "<form id='popup' method='post'><fieldset><div><label for='titre'>Titre</label>";
	html += "<input id='titre" + i + "' type='text'></input>";
	html += "</div><div><label for='message'>Message</label><textarea id='discussion-message" + i + "'></textarea>";
	html += "</div><div style='text-align: center;'><button id='discussion-button" + i + "' class='b-close'>Ouvrir une discussion</button>";
	html += "<button type='button' class='b-close'>Annuler</button></div></fieldset></form>";
	$("#inline_discussion" + i).html(html);
	
	$("#discussion-button" + i).click(function() {
		var titre = $("#titre" + i).val().length == 0 ? unescape(merchantName) : $("#titre" + i).val();
		var message = $("#discussion-message" + i).val().length == 0 ? "J'ai trouvé le contenu suivant via la recherche PJ :": $("#discussion-message" + i).val(); 
		message += "<br/>" + unescape(merchantUrl);
	    var forumTopic = new Object();
	    forumTopic.titre = titre;
	    forumTopic.message = message;
		$.ajax ({
			type: "POST",
	        contentType: "application/json",
	        dataType: "json",
	        cache: true,
	        url: "/rest/searchManagement/addTopic",
	        data: JSON.stringify(forumTopic),
	    })
	    .fail (
	    )
	    .done (
	    );
	});
	
	$("#inline_discussion" + i).bPopup ({
		follow: (true, true),
	    position: ["auto", 100],
	    modalClose: false
	});
}

function displayNumber(contactInfoHtml, i) {
	$("#displayNumber" + i).html(contactInfoHtml);
}

function shareSearchResult(merchantName, merchantUrl, i) {
	var html = "<form id='popup' method='post'><fieldset><div><label for='type'>Type</label>";
	html += "<select id='type" + i + "'><option value='user' >Utilisateur</option><option value='space'>Espace</option></select>";
	html += "</div><div id='bloc_espace" + i + "' style='display: none;'><label for='espace'>Espace</label><select id='espace" + i + "'></select>";
	html += "</div><div><label for='message'>Message</label><textarea id='message" + i + "'></textarea>";
	html += "</div><div style='text-align: center;'><button id='share-button" + i + "' class='b-close'>Partager</button>";
	html += "<button type='button' class='b-close'>Annuler</button></div></fieldset></form>";
	$("#inline_partage" + i).html(html);
	$("#type" + i).change(function() {
		if ($("#type" + i).val() != "user"){
			$.ajax ({
		        cache: true,
		        url: "/rest/portal/social/spaces/mySpaces/show.json",
		    })
		    .fail (
		        function() {
		        }
		    )
		    .done (
		        function(result) {
		        	var spaces = result["spaces"];
		        	var html = "";
		        	if (spaces !== undefined && spaces.length > 0){
		        		$("#bloc_espace" + i).show();
		        		for (j = 0; j < spaces.length; j++){
		        			html += "<option value='" + spaces[j]["name"] + "'>" + spaces[j]["name"]  + "</option>"
		        		}
		        		$("#espace" + i).html(html);
		        	}
		        }
		   );
		}
		else {
			$("#bloc_espace" + i).hide();
		}
	});
	
	$("#share-button" + i).click(function() {
		var type = $("#type" + i).val();
		var espace = $("#espace" + i).val();
		var message = $("#message" + i).val().length == 0 ? "J'ai trouvé le contenu suivant via la recherche PJ :": $("#message" + i).val();
		var postedMessage = "<b>" + message + "</b><br/>" + unescape(merchantName) + ": " + unescape(merchantUrl);
	    var asMessage = new Object();
	    asMessage.type = type;
	    asMessage.espace = espace;
	    asMessage.postedMessage = postedMessage;
		$.ajax ({
			type: "POST",
	        contentType: "application/json",
	        dataType: "json",
	        cache: true,
	        url: "/rest/searchManagement/shareSearchResult",
	        data: JSON.stringify(asMessage),
	    })
	    .fail (
	    )
	    .done (
	    );
	});
	
	$("#inline_partage" + i).bPopup ({
		follow: (true, true),
	    position: ["auto", 100],
	    modalClose: false
	});
}

function updateSearchResults(serviceUriParams, proximity) {
	var quoiqui = $("#quoiqui").val();
	var ou = $("#ou").val();
	var prefs = new gadgets.Prefs();
	var adresseEntreprise = prefs.getString("adresseEntreprise");
	var uri = "/rest/searchManagement/getSearchResults/";
	uri += serviceUriParams !== undefined ? serviceUriParams : "max=3&what=" + quoiqui + "&where=" + ou + "&return_urls=true";
	uri += proximity !== undefined ? "&proximity=" + proximity + "&where="+ adresseEntreprise + "&return_urls=true": "";
	var where = uri.split("&where=")[1].split("&")[0];
	var what = uri.split("&what=")[1].split("&")[0];
	var html = "<h2 style='text-align: center;font-weight:bold'>Aucun résultat</h2>";
	var lrRandomNumber = Math.floor(Math.random()*1000000)
	var lrStatHtml = "<img alt='' src='http://logc258.at.pagesjaunes.fr/hit.xiti?s=540649&p=LR_PJ&x1=<code_activite>&x2=<code_localite>&rn=" + lrRandomNumber + "'>";
	
	$.ajax ({
        cache: true,
        url: uri,
    })
    .fail (
        function() {
        	html += lrStatHtml;
        	$("div#searchResults").html(html);
        }
    )
    .done (
        function (result) {
        	var listings = result["search_results"]["listings"];
        	where = where == "" ? result["context"]["search"]["where"] : where;
        	$("#quoiqui").val(what);
        	$("#ou").val(where);
        	if (listings !== undefined){
	        	var totalListing = result["context"]["results"]["total_listing"];
	            html = "<h2 style='text-align: center;font-weight:bold'>" + what + " à " + where + " : " + totalListing + " résultats" + "</h2>";
	            var thumbnailUrl;
	            var merchantName;
	            var inscriptions;
	            var adressStreet;
	            var distance;
	            var contactInfo;
	            var itineraryUrl;
	            var merchantUrl;
	            var description;
	            var currentPage = result["context"]["pages"]["current_page"];
	            for (i = 0; i < listings.length; i++){
	            	thumbnailUrl = listings[i]["thumbnail_url"];
	            	if (thumbnailUrl != null){
	            		html += "<img src='" + thumbnailUrl + "'/>";
	            	}
	            	merchantName = listings[i]["merchant_name"];
	            	inscriptions = listings[i]["inscriptions"];
	            	for (j = 0; j < inscriptions.length; j++){
	            		adressStreet = inscriptions[j]["adress_street"];
	            		distance = inscriptions[j]["distance"];
	            		contactInfo = inscriptions[j]["contact_info"];
	            		itineraryUrl = inscriptions[j]["urls"]["itinerary_url"];
	            		merchantUrl = inscriptions[j]["urls"]["merchant_url"];
	            		break;
	            	}
	            	if (merchantName != null){
	            		html += "<b style='text-decoration:underline;font-size:small;'>" + merchantName + "</b>";
	            	}
	            	if (distance != null){
	            		html += "<span> à " + distance + "m</span>";
	            	}
	            	if (adressStreet != null){
	            		html += "<br/><span style='color:grey;font-size:small;'>" + adressStreet + "</span><br/>";
	            	}
	            	description = listings[i]["description"];
	            	if (description != null){
	            		html += "<span style='font-size:small;'>" + description + "</span>";
	            	}
	            	if (contactInfo != null){
	            		var contactInfoHtml = "";
	            		for (k = 0; k < contactInfo.length; k++){
	            			contactInfoHtml += "<b>" + contactInfo[k]["contact_type"] + "</b>: " + contactInfo[k]["contact_value"] + "<br/>";
            			}
	            		html += "<span id='displayNumber" + currentPage + i + "'><button onClick='displayNumber(\"" + contactInfoHtml + "\",\"" + currentPage + i + "\");return xt_click(this,\"C\",\"\",\"BI::contact::afficher_numero\",\"A\");'>Afficher le numéro</button></span><br/>";
	            	}
	            	html += "<a onClick='return xt_click(this,\"C\",\"\",\"BI::contact::itineraire\",\"A\");' href='" + itineraryUrl + "' target='_blank' style='font-weight:bold;text-decoration:underline;font-size:small;color:blue'>Itinéraire</a>";
	            	html += "<a href='#' onClick='shareSearchResult(\"" + escape(merchantName)  + "\",\"" + escape(merchantUrl) + "\",\"" + currentPage + i + "\");return xt_click(this,\"C\",\"\",\"BI::partager\",\"A\");' style='margin-left:200px;font-weight:bold;text-decoration:underline;font-size:small;color:blue'>Partager</a>";
	            	html += "<a href='#' onClick='addTopic(\"" + escape(merchantName)  + "\",\"" + escape(merchantUrl) + "\",\"" + currentPage + i + "\");return xt_click(this,\"C\",\"\",\"BI::discussion\",\"A\");' style='margin-left: 300px;font-weight:bold;text-decoration:underline;font-size:small;color:blue'>Ouvrir une discussion</a><br/>";
	            	if ($("#inline_partage" + currentPage + i).length == 0){
	            		html += "<div style='display:none' id='inline_partage" + currentPage + i + "'></div>";
	            	}
	            	if ($("#inline_discussion" + currentPage + i).length == 0){
	            		html += "<div style='display:none' id='inline_discussion" + currentPage + i + "'></div>";
	            	}
	            	html += "________________________________________________________________________<br/>";
	            }
	            var prevPageUrl = result["context"]["pages"]["prev_page_url"];
	            var nextPageUrl = result["context"]["pages"]["next_page_url"];
	            if (prevPageUrl != null){
		            var whereAttribute = prevPageUrl.split("&where=")[1].split("&")[0];
		            prevPageUrl = prevPageUrl.split(whereAttribute)[0] + where + prevPageUrl.split(whereAttribute)[1];
		        	var whatAttribute = prevPageUrl.split("&what=")[1].split("&")[0];
		        	prevPageUrl = prevPageUrl.split(whatAttribute)[0] + what + prevPageUrl.split(whatAttribute)[1];
	            	html += "<a style='font-weight:bold;' href='#' onClick='updateSearchResults(\"" + prevPageUrl.split('?')[1] + "\")'>Page précédante</a>";
	            }
	            if (nextPageUrl != null){
	            	var whereAttribute = nextPageUrl.split("&where=")[1].split("&")[0];
	            	nextPageUrl = nextPageUrl.split(whereAttribute)[0] + where + nextPageUrl.split(whereAttribute)[1];
			        var whatAttribute = nextPageUrl.split("&what=")[1].split("&")[0];
			        nextPageUrl = nextPageUrl.split(whatAttribute)[0] + what + nextPageUrl.split(whatAttribute)[1];
	            	html += "<a style='font-weight:bold;float:right' href='#' onClick='updateSearchResults(\"" + nextPageUrl.split('?')[1] + "\")'>Page suivante</a>";
	            }
            }
        	html += lrStatHtml; 
        	$("div#searchResults").html(html);
        }
    );
}

function xt_click(obj,type,section,page,x1,x2,x3,x4,x5) {             
	var xtImg=new Image(),xtDate=new Date(),xtScr=window.screen,xtNav=window.navigator,xtObj=null;         
	var xtSrc='http://logc258.at.pagesjaunes.fr/hit.xiti?s=540649&s2='+section+'&p='+page+((type=='F')?'':(type=='M')?'&a='+x1+'&m1='+x2+'&m2='+x3+'&m3='+x4+'&m4='+x5:'&clic='+x1)+'&hl='+xtDate.getHours()+'x'+xtDate.getMinutes()+'x'+xtDate.getSeconds();               
	if(parseFloat(xtNav.appVersion)>=4){
		xtSrc+='&r='+xtScr.width+'x'+xtScr.height+'x'+xtScr.pixelDepth+'x'+xtScr.colorDepth;
	}
	xtImg.src=xtSrc;xtImg.onload=function(){xtImg.onload=null;};    
	if(obj.nodeName!='A'){
		var xelp=obj.parentNode;
		while(xelp){
			if(xelp.nodeName=='A'){
				xtObj=xelp;break;
			}
		xelp=xelp.parentNode;
		}
	} 
	else {
		xtObj=obj;
	}             
	if(xtObj){
		xtObj.target=xtObj.target||'_self';
		if(x2&&(type=='C')){
			xtObj.href=x2;
			if(x3){
				xtObj.target='_blank';
			}
			else{
				xtObj.target='_self';
			}
		}
		if(!xtkey){
			if(xtObj.target.toLowerCase()=='_self'){
				setTimeout('self.location.href="'+xtObj.href+'"',500);
				return false;
			} 
			else if(xtObj.target.toLowerCase()=='_top'){
				setTimeout('top.location.href="'+xtObj.href+'"',500);
				return false;
			} 
			else if(xtObj.target.toLowerCase()=='_parent'){
				setTimeout('parent.location.href="'+xtObj.href+'"',500);
				return false;
			}
		}
	} 
	else if(x2&&(type=='C')){
		if(x3){
			setTimeout('(window.open("'+x2+'","_blank")).focus();',500);
		} 
		else{
			setTimeout('self.location.href="'+x2+'"',500);
		}
	}
	xtkey=false;
	return true;
}
