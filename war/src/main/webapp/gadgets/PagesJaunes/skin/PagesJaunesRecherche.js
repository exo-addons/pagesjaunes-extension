function updateSearchResults() {
	var url = "http://api.apipagesjaunes.fr/v2/pro/find.json?what=hotels&where=dunkerque&app_id=e74d895a&app_key=5050ac249e48f00795c39a06a8af7235";
	$.getJSON(url,function(result){
	  alert(result);
    });
}