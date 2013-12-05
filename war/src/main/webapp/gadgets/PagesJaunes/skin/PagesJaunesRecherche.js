function PagesJaunesRechercheGadget() {
};

PagesJaunesRechercheGadget.prototype.onLoadHander = function() {
	PagesJaunesRechercheGadget.getData();
}

PagesJaunesRechercheGadget.prototype.createServiceRequestUrl = function() {
  var serviceUrl = "http://api.apipagesjaunes.fr/v2/pro/find.json?what=hotels&where=dunkerque&max=15&page=1&proximity=false&return_urls=false&map_height=300&map_width=300&app_id=e74d895a&app_key=5050ac249e48f00795c39a06a8af7235";	
  return serviceUrl;
}

PagesJaunesRechercheGadget.prototype.getData = function() {
  //var url = encodeURI(PagesJaunesRechercheGadget.createServiceRequestUrl());
  var url = "http://api.apipagesjaunes.fr/v2/pro/find.json?what=hotels&where=dunkerque&max=15&page=1&proximity=false&return_urls=false&map_height=300&map_width=300&app_id=e74d895a&app_key=5050ac249e48f00795c39a06a8af7235";	
  PagesJaunesRechercheGadget.ajaxAsyncGetRequest(url, PagesJaunesRechercheGadget.render);
}

PagesJaunesRechercheGadget.prototype.render = function(data) {
    document.getElementById('searchResults').innerHTML = '<p>'+JSON.stringify(data)+'</p>';
}

PagesJaunesRechercheGadget.prototype.ajaxAsyncGetRequest = function(url, callback) {
	var request = new XMLHttpRequest() || new ActiveXObject("Msxml2.XMLHTTP");
	request.open('GET', url, true);
	request.setRequestHeader("Cache-Control", "max-age=86400");
	//request.setRequestHeader("Access-Control-Allow-Origin", "*");
	request.send(null);
	if (!callback) {
		return;
	}
	request.onreadystatechange = function () {
		if (request.readyState == 4 && (request.status == 200 || request.status == 204)) {
			callback(gadgets.json.parse(request.responseText));
		}
	}
}
PagesJaunesRechercheGadget = new PagesJaunesRechercheGadget();
//alert(document.getElementById('quoiqui').value);
gadgets.util.registerOnLoadHandler(PagesJaunesRechercheGadget.onLoadHander);

