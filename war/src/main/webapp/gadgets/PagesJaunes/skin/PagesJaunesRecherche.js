function updateSearchResults() {
	var quoiqui = $("#quoiqui").val();
	var ou = $("#ou").val();
	$.ajax ({
        cache: true,
        url: "http://localhost:8080/rest/searchManagement/getSearchResult/" + quoiqui + "/" + ou,
    })
    .fail
    (
        function () {
        }
    )
    .done
    (
        function (result) {
        	var totalListing = result["context"]["results"]["total_listing"];
            var html = "<b>" + quoiqui + " à " + ou + " : " + totalListing + " résultats" + "</b></br></br>";
            var listings = result["search_results"]["listings"];
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
            		html += "<b style='text-decoration:underline;font-size:small;'>" + merchantName + "</b></br>";
            	}
            	inscriptions = listings[i]["inscriptions"];
            	for (j = 0; j < inscriptions.length; i++){
            		adressStreet = inscriptions[j]["adress_street"];
            		break;
            	}
            	if (adressStreet != null) {
            		html += "<span style='color:grey;font-size:small;'>" + adressStreet + "</span></br>";
            	}
            	description = listings[i]["description"];
            	if (description != null){
            		html += "<span style='font-size:small;'>" + description + "</span></br>";
            	}
            	html += "________________________________________________________________________</br>";
            }
            
        	$("div#searchResults").html(html);
        }
    );
}