function updateSearchResults(serviceUriParams) {
	var quoiqui = $("#quoiqui").val();
	var ou = $("#ou").val();
	var uri = "/rest/searchManagement/getSearchResults/";
	uri += serviceUriParams !== undefined ? serviceUriParams :"max=4&what="+ quoiqui + "&where=" + ou;
	uri += "&proximity=false&return_urls=true&app_id=e74d895a&app_key=5050ac249e48f00795c39a06a8af7235";
	var html = "<h2 style='text-align: center;font-weight:bold'>Aucun résultat</h2>";
	$.ajax ({
        cache: true,
        url: uri,
    })
    .fail (
        function () {
        	$("div#searchResults").html(html);
        }
    )
    .done (
        function (result) {
        	var listings = result["search_results"]["listings"];
        	if (listings !== undefined){
	        	var totalListing = result["context"]["results"]["total_listing"];
	            html = "<h2 style='text-align: center;font-weight:bold'>" + quoiqui + " à " + ou + " : " + totalListing + " résultats" + "</h2>";
	            var thumbnailUrl;
	            var merchantName;
	            var inscriptions;
	            var adressStreet;
	            var itineraryUrl;
	            var merchantUrl;
	            var description;
	            for (i = 0; i < listings.length; i++) {
	            	thumbnailUrl = listings[i]["thumbnail_url"];
	            	if (thumbnailUrl != null){
	            		html += "<img src='" + thumbnailUrl + "'/>";
	            	}
	            	merchantName = listings[i]["merchant_name"];
	            	if (merchantName != null){
	            		html += "<b style='text-decoration:underline;font-size:small;'>" + merchantName + "</b><br/>";
	            	}
	            	inscriptions = listings[i]["inscriptions"];
	            	for (j = 0; j < inscriptions.length; j++){
	            		adressStreet = inscriptions[j]["adress_street"];
	            		itineraryUrl = inscriptions[j]["urls"]["itinerary_url"];
	            		merchantUrl = inscriptions[j]["urls"]["merchant_url"];
	            		break;
	            	}
	            	if (adressStreet != null) {
	            		html += "<span style='color:grey;font-size:small;'>" + adressStreet + "</span><br/>";
	            	}
	            	description = listings[i]["description"];
	            	if (description != null){
	            		html += "<span style='font-size:small;'>" + description + "</span><br/>";
	            	}
	            	html += "<a href='" + itineraryUrl + "' target='_blank' style='font-weight:bold;text-decoration:underline;font-size:small;color:blue'>Itinéraire</a>";
	            	html += "<a onClick='shareSearchResult(\"" + escape(merchantName)  + "\",\"" + escape(merchantUrl) + "\")' style='margin-left:200px;font-weight:bold;text-decoration:underline;font-size:small;color:blue'>Partager</a>";
	            	html += "<a id='discussion' style='margin-left: 300px;font-weight:bold;text-decoration:underline;font-size:small;color:blue'>Ouvrir une discussion</a><br/>";
	            	html += "________________________________________________________________________<br/>";
	            }
	            var prevPageUrl = result["context"]["pages"]["prev_page_url"];
	            var nextPageUrl = result["context"]["pages"]["next_page_url"];
	            if (prevPageUrl != null){
	            	html += "<a style='font-weight:bold;' href='#' onClick='updateSearchResults(\"" + prevPageUrl.split('?')[1] + "\")'>Page précédante</a>";
	            }
	            if (nextPageUrl != null){
	            	html += "<a style='font-weight:bold;float:right' href='#' onClick='updateSearchResults(\"" + nextPageUrl.split('?')[1] + "\")'>Page suivante</a>";
	            }
            }    
        	$("div#searchResults").html(html);
        }
    );
}

function shareSearchResult(merchantName, merchantUrl) {
	$("#share-button").click(function(){
		
		var type = $("#type").val();
		var message = $("#message").val().length == 0 ? "j'ai trouvé le contenu suivant via la recherche PJ :": $("#message").val();
		var postedMessage = "<b>" + message + "</b><br/>" + unescape(merchantName) + ": " + unescape(merchantUrl);
		$.ajax ({
	        cache: true,
	        url: "/rest/searchManagement/shareSearchResult/" + postedMessage + "+" + type,
	    })
	    .fail (
	    )
	    .done (
	    		function () {
	    			alert("Votre résultat de recherche a été partagé avec succès");
	    	    }
	    );
	});

	$('#inline').bPopup
	  ({
	      follow: (true, true),
	      position: ['auto', 100],
	      modalClose: false
	  });
}

