function makeJSONRequest() {    
	var params = {};
	params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
	var quoiqui = document.getElementById('quoiqui');
	var ou = document.getElementById('ou');
	alert(quoiqui);
	alert(ou);
	// This URL returns a JSON-encoded string that represents a JavaScript object
	var url = "http://api.apipagesjaunes.fr/v2/pro/find.json?what=hotels&where=dunkerque&max=15&page=1&proximity=false&return_urls=false&map_height=300&map_width=300&app_id=e74d895a&app_key=5050ac249e48f00795c39a06a8af7235";
	gadgets.io.makeRequest(url, response, params);
};

function response(obj) { 
	var jsondata = obj.data;
    var html = "<p>"+JSON.stringify(jsondata)+"</p>";;
    document.getElementById('searchResults').innerHTML = html;
};
gadgets.util.registerOnLoadHandler(makeJSONRequest);