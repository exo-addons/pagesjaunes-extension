$(document).keypress(function(event) {
	var keycode = (event.keyCode ? event.keyCode : event.which);
	if(keycode == "13") {
		updateSearchResults();	
	}
});

function displayNumber(contactInfoHtml, i) {
	$("#displayNumber" + i).html(contactInfoHtml);
}

function shareSearchResult(merchantName, merchantUrl, i) {
	var html = "<form id='partage' method='post'><fieldset><div><label for='type'>Type</label>";
	html += "<select id='type" + i + "' name='type'><option value='user' >Utilisateur</option><option value='space'>Espace</option></select>";
	html += "</div><div id='bloc_espace" + i + "' style='display: none;'><label for='espace'>Espace</label><select id='espace" + i + "' name='espace'></select>";
	html += "</div><div><label for='message'>Message</label><textarea name='message' id='message" + i + "'></textarea>";
	html += "</div><div style='text-align: center;'><button id='share-button" + i + "' class='b-close'>Partager</button>";
	html += "<button id='cancel" + i + "' type='button' class='b-close'>Annuler</button></div></fieldset></form>";
	$("#inline" + i).html(html);
	$("#type" + i).change(function() {
		if ($("#type" + i).val() != "user") {
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
		        	if (spaces !== undefined && spaces.length > 0) {
		        		$("#bloc_espace" + i).show();
		        		for (j = 0; j < spaces.length; j++) {
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
	
	$("#inline" + i).bPopup ({
		follow: (true, true),
	    position: ["auto", 100],
	    modalClose: false
	});
}

function updateSearchResults(serviceUriParams) {
	var quoiqui = $("#quoiqui").val();
	var ou = $("#ou").val();
	var uri = "/rest/searchManagement/getSearchResults/";
	uri += serviceUriParams !== undefined ? serviceUriParams :"max=3&what="+ quoiqui + "&where=" + ou;
	uri += "&proximity=false&return_urls=true&app_id=e74d895a&app_key=5050ac249e48f00795c39a06a8af7235";
	var html = "<h2 style='text-align: center;font-weight:bold'>Aucun résultat</h2>";
	$.ajax ({
        cache: true,
        url: uri,
    })
    .fail (
        function() {
        	$("div#searchResults").html(html);
        }
    )
    .done (
        function (result) {
        	var listings = result["search_results"]["listings"];
        	if (listings !== undefined) {
	        	var totalListing = result["context"]["results"]["total_listing"];
	            html = "<h2 style='text-align: center;font-weight:bold'>" + quoiqui + " à " + ou + " : " + totalListing + " résultats" + "</h2>";
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
	            for (i = 0; i < listings.length; i++) {
	            	thumbnailUrl = listings[i]["thumbnail_url"];
	            	if (thumbnailUrl != null) {
	            		html += "<img src='" + thumbnailUrl + "'/>";
	            	}
	            	merchantName = listings[i]["merchant_name"];
	            	inscriptions = listings[i]["inscriptions"];
	            	for (j = 0; j < inscriptions.length; j++) {
	            		adressStreet = inscriptions[j]["adress_street"];
	            		distance = inscriptions[j]["distance"];
	            		contactInfo = inscriptions[j]["contact_info"];
	            		itineraryUrl = inscriptions[j]["urls"]["itinerary_url"];
	            		merchantUrl = inscriptions[j]["urls"]["merchant_url"];
	            		break;
	            	}
	            	if (merchantName != null) {
	            		html += "<b style='text-decoration:underline;font-size:small;'>" + merchantName + "</b>";
	            	}
	            	if (distance != null) {
	            		html += "<span> à " + distance + "m</span><br/>";
	            	}
	            	if (adressStreet != null) {
	            		html += "<span style='color:grey;font-size:small;'>" + adressStreet + "</span><br/>";
	            	}
	            	description = listings[i]["description"];
	            	if (description != null) {
	            		html += "<span style='font-size:small;'>" + description + "</span>";
	            	}
	            	if (contactInfo != null) {
	            		var contactInfoHtml = "";
	            		for (k = 0; k < contactInfo.length; k++) {
	            			contactInfoHtml += "<b>" + contactInfo[k]["contact_type"] + "</b>: " + contactInfo[k]["contact_value"] + "<br/>";
            			}
	            		html += "<span id='displayNumber" + currentPage + i + "'><button onClick='displayNumber(\"" + contactInfoHtml + "\",\"" + currentPage + i + "\")'>Afficher le numéro</button></span><br/>";
	            	}
	            	html += "<a href='" + itineraryUrl + "' target='_blank' style='font-weight:bold;text-decoration:underline;font-size:small;color:blue'>Itinéraire</a>";
	            	html += "<a href='#' onClick='shareSearchResult(\"" + escape(merchantName)  + "\",\"" + escape(merchantUrl) + "\",\"" + currentPage + i + "\")' style='margin-left:200px;font-weight:bold;text-decoration:underline;font-size:small;color:blue'>Partager</a>";
	            	html += "<a href='#' id='discussion' style='margin-left: 300px;font-weight:bold;text-decoration:underline;font-size:small;color:blue'>Ouvrir une discussion</a><br/>";
	            	if ($("#inline" + currentPage + i).length == 0){
	            		html += "<div style='display:none' id='inline" + currentPage + i + "'></div>";
	            	}
	            	html += "________________________________________________________________________<br/>";
	            }
	            var prevPageUrl = result["context"]["pages"]["prev_page_url"];
	            var nextPageUrl = result["context"]["pages"]["next_page_url"];
	            if (prevPageUrl != null) {
	            	html += "<a style='font-weight:bold;' href='#' onClick='updateSearchResults(\"" + prevPageUrl.split('?')[1] + "\")'>Page précédante</a>";
	            }
	            if (nextPageUrl != null) {
	            	html += "<a style='font-weight:bold;float:right' href='#' onClick='updateSearchResults(\"" + nextPageUrl.split('?')[1] + "\")'>Page suivante</a>";
	            }
            }    
        	$("div#searchResults").html(html);
        }
    );
}
