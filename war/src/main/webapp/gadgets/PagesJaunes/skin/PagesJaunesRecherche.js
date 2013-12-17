$(document).keypress(function(event) {
	var keycode = (event.keyCode ? event.keyCode : event.which);
	if(keycode == "13") {
		updateSearchResults();	
	}
});

function displayNumber(contactInfoHtml, i) {
	$("#displayNumber" + i).html(contactInfoHtml);
}

function shareSearchResult(merchantName, merchantUrl) {
	$("#type").change(function() {
		if ($("#type").val() != "user") {
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
		        		$("#bloc_espace").show();
		        		for (i = 0; i < spaces.length; i++) {
		        			html += "<option value='" + spaces[i]["name"] + "'>" + spaces[i]["name"]  + "</option>"
		        		}
		        		$("#espace").html(html);
		        	}
		        }
		   );
		}
		else {
			$("#espace").html("");
			$("#bloc_espace").hide();
		}
	});
	
	$("#share-button").click(function() {
		var espace = $("#espace").val();
		var message = $("#message").val().length == 0 ? "J'ai trouvé le contenu suivant via la recherche PJ :": $("#message").val();
		var postedMessage = "<b>" + message + "</b><br/>" + unescape(merchantName) + ": " + unescape(merchantUrl);
	    var asMessage = new Object();
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
		$("#message").val("");
		$("#type").val("user");
		$("#bloc_espace").hide();
	});
	
	$("#cancel").click(function() {
		$("#message").val("");
		$("#type").val("user");
		$("#bloc_espace").hide();
	});

	$("#inline").bPopup ({
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
	uri += "&proximity=true&return_urls=true&app_id=e74d895a&app_key=5050ac249e48f00795c39a06a8af7235";
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
	            		html += "<span id='displayNumber" + i + "'><button onClick='displayNumber(\"" + contactInfoHtml + "\",\"" + i + "\")'>Afficher le numéro</button></span><br/>";
	            	}
	            	html += "<a href='" + itineraryUrl + "' target='_blank' style='font-weight:bold;text-decoration:underline;font-size:small;color:blue'>Itinéraire</a>";
	            	html += "<a href='#' onClick='shareSearchResult(\"" + escape(merchantName)  + "\",\"" + escape(merchantUrl) + "\")' style='margin-left:200px;font-weight:bold;text-decoration:underline;font-size:small;color:blue'>Partager</a>";
	            	html += "<a href='#' id='discussion' style='margin-left: 300px;font-weight:bold;text-decoration:underline;font-size:small;color:blue'>Ouvrir une discussion</a><br/>";
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
