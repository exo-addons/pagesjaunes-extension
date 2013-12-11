function updateSearchResults(serviceUriParams) {
	var quoiqui = $("#quoiqui").val();
	var ou = $("#ou").val();
	var uri = "/rest/searchManagement/getSearchResults/";
	uri += serviceUriParams !== undefined ? serviceUriParams :"max=4&what="+ quoiqui + "&where=" + ou;
	uri += "&app_id=e74d895a&app_key=5050ac249e48f00795c39a06a8af7235";
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
	            var description;
	            for (i = 0; i < listings.length; i++){
	            	thumbnailUrl = listings[i]["thumbnail_url"];
	            	if (thumbnailUrl != null){
	            		html += "<img src='" + thumbnailUrl + "'/>";
	            	}
	            	merchantName = listings[i]["merchant_name"];
	            	if (merchantName != null){
	            		html += "<b style='text-decoration:underline;font-size:small;'>" + merchantName + "</b><br/>";
	            	}
	            	inscriptions = listings[i]["inscriptions"];
	            	for (j = 0; j < inscriptions.length; i++){
	            		adressStreet = inscriptions[j]["adress_street"];
	            		break;
	            	}
	            	if (adressStreet != null) {
	            		html += "<span style='color:grey;font-size:small;'>" + adressStreet + "</span><br/>";
	            	}
	            	description = listings[i]["description"];
	            	if (description != null){
	            		html += "<span style='font-size:small;'>" + description + "</span><br/>";
	            	}
	            	html += "<a onClick='shareSearchResult(\"" + escape(thumbnailUrl) + "\",\"" + escape(merchantName) + "\",\"" + escape(adressStreet) + "\",\"" + escape(description) + "\")' style='font-weight:bold;text-decoration:underline;font-size:small;color:blue'>Partager</a><br/>";
	            	html += "________________________________________________________________________<br/>";
	            }
	            var prevPageUrl = result["context"]["pages"]["prev_page_url"];
	            var nextPageUrl = result["context"]["pages"]["next_page_url"];
	            if (prevPageUrl != null){
	            	html += "<a style='font-weight:bold;' onClick='updateSearchResults(\"" + prevPageUrl.split('?')[1] + "\")'>Page précédante</a>";
	            }
	            if (nextPageUrl != null){
	            	html += "<a style='font-weight:bold;float:right' onClick='updateSearchResults(\"" + nextPageUrl.split('?')[1] + "\")'>Page suivante</a>";
	            }
            }    
        	$("div#searchResults").html(html);
        	gadgets.window.adjustHeight();
        }
    );
}

function shareSearchResult(thumbnailUrl, merchantName, adressStreet, description) {
	var postedMessage = "";
	postedMessage += "<img src='" + unescape(thumbnailUrl) + "'/>";
	postedMessage += "<b style='text-decoration:underline;font-size:small;'>" + unescape(merchantName) + "</b><br/>";
	postedMessage += "<span style='color:grey;font-size:small;'>" + unescape(adressStreet) + "</span><br/>";
	postedMessage += "<span style='font-size:small;'>" + unescape(description) + "</span><br/>";
	$.ajax ({
        cache: true,
        url: "/rest/searchManagement/shareSearchResult/" + postedMessage,
    })
    .fail (
    )
    .done (
        function (result) {
        	alert("Votre résultat de recherche a été partagé avec succès");
        }
    );
}