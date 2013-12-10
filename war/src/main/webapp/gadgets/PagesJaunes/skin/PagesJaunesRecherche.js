function updateSearchResults() {
	var quoiqui = $("#quoiqui").val();
	var ou = $("#ou").val();
	$.ajax
    ({
        cache: true,
        url: "http://localhost:8080/rest/searchManagement/getSearchResult/" + quoiqui + "/" + ou,
    })
    .fail
    (
        function () 
        {
        }
    )
    .done
    (
        function (result) 
        {
             $("div#searchResults").html( result );
        }
    );
}