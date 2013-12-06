function updateSearchResults() {
    //$("#searchResults").append( $("#quoiqui").val() );
	var quoiqui = $("#quoiqui").val();
	var ou = $("#ou").val();
	//var url = "http://api.apipagesjaunes.fr/v2/pro/find.json?what=hotels&where=dunkerque&app_id=e74d895a&app_key=5050ac249e48f00795c39a06a8af7235";
	//var url = "http://localhost:8080/rest/searchManagement/getSearchResult/ayoub";
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
             //alert(result);
             $("#searchResults").replaceWith( result );
        }
    );
//	$.getJSON(url,function(result){
//	  alert(result);
//    });
}