/*
 * Copyright (C) 2003-2013 eXo Platform SAS.
 *
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 3 of
 * the License, or (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 */
var xtkey;
Globalize.culture("fr");
$(document).ready(function() {
	var hpRandomNumber = Math.floor(Math.random()*1000000)
	var hpStatHtml = "<img alt='' src='http://logc258.at.pagesjaunes.fr/hit.xiti?s=540649&p=HP_PJ&rn=" + hpRandomNumber + "'>";
	$("#searchForm").append(hpStatHtml);
	xtkey=false;
	if(document.addEventListener) {
		document.addEventListener('keydown',function() {xtkey=true},false);
		document.addEventListener('keyup',function() {xtkey=false},false);
	}
	else if(document.attachEvent) {
		document.attachEvent('onkeydown',function() {xtkey=true});
		document.attachEvent('onkeyup',function() {xtkey=false});
	}
	$.ajax ({
        cache: true,
        url: "/rest/searchManagement/addInstallStatNode",
    })
    .fail (
    )
    .done (
    	function(result) {
    		if (result == "true") {
    			//alert("Addon PJ installé");
    		}
    	}
    );
});

$(document).keypress(function(event) {
	var keycode = (event.keyCode ? event.keyCode : event.which);
	if(keycode == "13") {
		updateSearchResults();
		return xt_click(this,'C','','Trouver::Trouver_HP','A');
	}
});

function addTopic(merchantName, merchantUrl, i) {
	var html = "<div id='popup' class='UIPopupWindow uiPopup UIDragObject NormalStyle' style='width: 560px; position: relative; top: auto; left: auto; margin: 0 auto 20px; z-index: 1; max-width: 100%;'>";
	html += "<div class='popupHeader ClearFix'><span class='PopupTitle popupTitle'>" + Globalize.localize("discussion") + "</span></div>";
	html += "<div class='PopupContent popupContent'><div class='form-horizontal resizable'>";
	html += "<div class='control-group'><label for='titre' class='control-label'>" + Globalize.localize("title") + "</label> <div class='controls'><input type='text' id='titre" + i + "' value=\"" + unescape(merchantName) + "\"></div></div>";
	html += "<div class='control-group'><label for='message' class='control-label'>" + Globalize.localize("message") + "</label> <div class='controls'><textarea id='discussion-message" + i + "'>" + Globalize.localize("defaultMessage") + "</textarea></div></div>";
	html += "</div><div class='uiAction uiActionBorder'><button id='discussion-button" + i + "' class='b-close btn' type='button'>" + Globalize.localize("discussion") + "</button>";
	html += "<button class='b-close btn' type='button'>" + Globalize.localize("cancel") + "</button></div></div><span class='uiIconResize pull-right uiIconLightGray'></span></div>";
	$("#inline_discussion" + i).html(html);
	
	$("#discussion-button" + i).click(function() {
	    var forumTopic = new Object();
	    forumTopic.titre = $("#titre" + i).val();
	    forumTopic.message = $("#discussion-message" + i).val() + "<br/>" + unescape(merchantUrl);
		$.ajax ({
			type: "POST",
	        contentType: "application/json",
	        dataType: "json",
	        cache: true,
	        url: "/rest/searchManagement/addTopic",
	        data: JSON.stringify(forumTopic),
	    })
	    .done(function(result) {
	    	var currentUrl = window.top.location.href;
	    	var redirect = currentUrl.split("//")[0] + "//" + currentUrl.split("//")[1].split("/")[0] + "/" + currentUrl.split("//")[1].split("/")[1] + "/" + (currentUrl.split("//")[1].split("/")[2] != "u" ? currentUrl.split("//")[1].split("/")[2] : "intranet") + "/forum/topic/" + result["topicId"];
	    	window.top.location.href = redirect;
	    })
	    .fail (
	    )
	});
	
	$("#inline_discussion" + i).bPopup ({
		follow: (true, true),
	    position: ["auto", 500],
	    modalClose: false
	});
}

function displayNumber(contactInfoHtml, i) {
	$("#displayNumber" + i).html(unescape(contactInfoHtml));
	var gadgetHeight = document.getElementById("searchForm").offsetHeight; 
	gadgets.window.adjustHeight(gadgetHeight + 1);
}

function edit() {
	var formHtml = "<div><div><span>" + Globalize.localize("companyAddress") + "</span><input id='adresse_entreprise'></div><div><button id='save' type='button'>" + Globalize.localize("save") + "</button><button id='cancel' type='button'>" + Globalize.localize("cancel") + "</button></div></div>"
	$("#editMode").html(formHtml);
	$.ajax ({
		cache: true,
		url: "/rest/searchManagement/getCompanyAddress",
    })
    .fail (
    )
    .done (
        function(result) {
        	if (result != null) {
        		$("#adresse_entreprise").val(result);
        	}
        }
   );
   var editHtml = "<div style='float:right;'><button onClick='edit();' type='button'>" + Globalize.localize("edit") + "</button></div>";
   $("#save").click(function() {
	   var companyAddress = new Object();
	   companyAddress.address = $("#adresse_entreprise").val();
	   $.ajax ({
		   type: "POST",
		   contentType: "application/json",
		   dataType: "json",
		   cache: true,
		   url: "/rest/searchManagement/saveCompanyAddress",
		   data: JSON.stringify(companyAddress),
	   })
	   .fail (
	   )
	   .done (
	   );
	   location.reload();
   });
   $("#cancel").click(function() {
	   $("#editMode").html(editHtml);
   });	
}

function shareSearchResult(merchantName, merchantUrl, i) {
	var html = "<div id='popup' class='UIPopupWindow uiPopup UIDragObject NormalStyle' style='width: 560px; position: relative; top: auto; left: auto; margin: 0 auto 20px; z-index: 1; max-width: 100%;'>";
	html += "<div class='popupHeader ClearFix'><span class='PopupTitle popupTitle'>" + Globalize.localize("share") + "</span></div>";
	html += "<div class='PopupContent popupContent'><div class='form-horizontal resizable'>";
	html += "<div class='control-group'><label for='type' class='control-label'>" + Globalize.localize("type") + "</label> <div class='controls'>";
	html += "<select id='type" + i + "'><option value='user'>" + Globalize.localize("user") + "</option><option value='space'>" + Globalize.localize("space") + "</option></select></div></div>";
	html += "<div id='bloc_espace" + i + "' style='display: none;' class='control-group'><label for='espace' class='control-label'>" + Globalize.localize("space") + "</label><div class='controls'><select id='espace" + i + "'></select></div></div>";
	html += "<div class='control-group'><label for='message' class='control-label'>" + Globalize.localize("message") + "</label> <div class='controls'><textarea id='message" + i + "'>" + Globalize.localize("defaultMessage") + "</textarea></div></div>";
	html += "</div><div class='uiAction uiActionBorder'><button id='share-button" + i + "' class='b-close btn' type='button'>" + Globalize.localize("share") + "</button>";
	html += "<button class='b-close btn' type='button'>" + Globalize.localize("cancel") + "</button></div></div><span class='uiIconResize pull-right uiIconLightGray'></span></div>";
	$("#inline_partage" + i).html(html);
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
		var postedMessage = "<b>" + $("#message" + i).val() + "</b><br/>" + unescape(merchantName) + ": " + unescape(merchantUrl);
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
	
	$("#inline_partage" + i).bPopup ({
		follow: (true, true),
	    position: ["auto", 500],
	    modalClose: false
	});
}

function showHideDetail(i) {
	if ($("#desc" + i).hasClass("desc")) {
		$("#desc" + i).removeClass("desc");
		$("#btnShowDetail" + i).html(Globalize.localize("hideDetail") + "<i class='uiIconArrowUp'></i>");
	}
	else {
		$("#desc" + i).addClass("desc");
		$("#btnShowDetail" + i).html(Globalize.localize("showDetail") + "<i class='uiIconArrowDown'></i>");
	}
	var gadgetHeight = document.getElementById("searchForm").offsetHeight; 
	gadgets.window.adjustHeight(gadgetHeight + 1);
}



function updateSearchResults(serviceUriParams, proximity) {
	$.ajax ({
		cache: true,
		url: "/rest/searchManagement/getCompanyAddress",
    })
    .fail (
    	function() {
        }
    )
    .done (
        function(response) {
        	var quoiqui = $("#quoiqui").val();
        	var ou = $("#ou").val();
        	var adresseEntreprise = response != null ? response : "";
        	var uri = "/rest/searchManagement/getSearchResults/";
        	uri += serviceUriParams !== undefined ? serviceUriParams : "max=3&what=" + quoiqui + "&where=" + ou + "&return_urls=true";
        	uri += proximity !== undefined ? "&proximity=" + proximity + "&where=" + adresseEntreprise + "&return_urls=true": "";
        	var where = uri.split("&where=")[1].split("&")[0];
        	var what = uri.split("&what=")[1].split("&")[0];
        	var html = "<div class='uiBox resultBox'><div class='msNotResult'><h3>" + Globalize.localize("noResult") + "</h3></div></div>";
        	var lrRandomNumber = Math.floor(Math.random()*1000000)
        	var lrStatHtml = "<img alt='' src='http://logc258.at.pagesjaunes.fr/hit.xiti?s=540649&p=LR_PJ&x1=<code_activite>&x2=<code_localite>&rn=" + lrRandomNumber + "'>";
        	
        	$.ajax ({
                cache: true,
                url: uri,
            })
            .fail (
                function(result) {
                	html += lrStatHtml;
                	$("div#searchResults").html(html);
                }
            )
            .done (
                function (result) {
                	var listings = result["search_results"]["listings"];
                	where = where == "" ? result["context"]["search"]["where"] : where;
                	$("#quoiqui").val(what);
                	$("#ou").val(where);
                	if (listings !== undefined) {
        	        	var totalListing = result["context"]["results"]["total_listing"];
        	            html = "<h4 class='countResult'>" + what + Globalize.localize("in") + where + " : " + totalListing + Globalize.localize("results") + "</h4>";
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
        	            var pageCount = result["context"]["pages"]["page_count"];
        	            html += "<div class='uiBox resultBox'><ul class='listResulPages'>";
        	            for (i = 0; i < listings.length; i++) {
        	            	html += "<li><div class='media'>";
        	            	thumbnailUrl = listings[i]["thumbnail_url"];
        	            	if (thumbnailUrl != null) {
        	            		html += "<div class='pull-left'><a href='#'><img src='" + thumbnailUrl + "' alt='logo'></a></div>";
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
        	            	html += "<div class='media-body'><div class='headResult clearfix'><div class='pull-left'><div class='title-text'>";
        	            	if (merchantName != null) {
        	            		html += "<a target='_blank' href=\"" + merchantUrl + "\">" + merchantName + "</a>";
        	            	}
        	            	if (distance != null) {
        	            		html += Globalize.localize("in") + distance + Globalize.localize("meter");
        	            	}
        	            	html += "</div>";
        	            	if (adressStreet != null) {
        	            		html += "<div class='address'>" + adressStreet + "</div>";
        	            	}
        	            	html += "</div></div><div class='cont'><div class='row-fluid'><div class='colRight'>";
        	            	description = listings[i]["description"];
        	            	//--if (description != null) {
        	            	//	html += "<button id='btnShowDetail" + currentPage + i + "' onClick='showHideDetail(\"" + currentPage + i + "\")' class='btn btnShowDetail'>" + Globalize.localize("showDetail") + "<i class='uiIconArrowDown'></i></button>";
        	            	//}
        	            	if (contactInfo != null) {
        	            		var contactInfoHtml = "";
        	            		contactInfoHtml += "<ul class='contactInfo'>";
        	            		for (k = 0; k < contactInfo.length; k++) {
        	            			var contactIcon;
        	            			switch (contactInfo[k]["contact_type"]) {
        		            			case "MAIL":
        		            				contactIcon = "uiIconMail uiIconLightGray";
        			            			break;
        		            			case "TELEPHONE":
        		            				contactIcon = "uiIconSocPhone uiIconSocLightGray";
        		            				break;
        		            			case "FAX":
        		            				contactIcon = "uiIconPrint uiIconLightGray";
        		            				break;
        	            			} 
        	            			contactInfoHtml += "<li><i class='" + contactIcon + "'></i><a href='#'>" + contactInfo[k]["contact_value"] + "</a></li>";
                    			}
        	            		contactInfoHtml += "</ul>";
        	            		var displayNumberClass = "flyBoxInfo ";
        	            		displayNumberClass += description != null ? "detail" : "noDetail";
        	            		html += "<div class='" + displayNumberClass + "' id='displayNumber" + currentPage + i + "'><button class='btn btn-primary btn-supper' onClick='displayNumber(\"" + escape(contactInfoHtml) + "\",\"" + currentPage + i + "\");return xt_click(this,\"C\",\"\",\"BI::contact::afficher_numero\",\"A\");'><i class='uiIconSocPhone'></i>" + Globalize.localize("displayNumber") + "</button></div>";
        	            	}
        	            	html += "</div><div class='colLeft'>";
        	            	if (description != null) {
        	            		html += "<div id='desc" + currentPage + i + "' class='desc'>" + description + "</div>";
        	            	}
        	            	html += "<div class='links'>";
        	            	html += "<a onClick='return xt_click(this,\"C\",\"\",\"BI::contact::itineraire\",\"A\");' href='" + itineraryUrl + "' target='_blank' >" + Globalize.localize("itinerary") + "</a> | ";
        	            	html += "<a href='#' onClick='shareSearchResult(\"" + escape(merchantName)  + "\",\"" + escape(merchantUrl) + "\",\"" + currentPage + i + "\");return xt_click(this,\"C\",\"\",\"BI::partager\",\"A\");' >" + Globalize.localize("share") + "</a> | ";
        	            	html += "<a href='#' onClick='addTopic(\"" + escape(merchantName)  + "\",\"" + escape(merchantUrl) + "\",\"" + currentPage + i + "\");return xt_click(this,\"C\",\"\",\"BI::discussion\",\"A\");' >" + Globalize.localize("discussion") + "</a>";
        	            	html += "</div></div>";
        	            	html += "</div></div></div></div>"
        	            	if ($("#inline_partage" + currentPage + i).length == 0) {
        	            		html += "<div class='inline' id='inline_partage" + currentPage + i + "'></div>";
        	            	}
        	            	if ($("#inline_discussion" + currentPage + i).length == 0) {
        	            		html += "<div class='inline' id='inline_discussion" + currentPage + i + "'></div>";
        	            	}
        	            	html += "</li>";
        	            }
        	            html += "</ul><div class='pagination pagination-right uiPageIterator'><ul>";
        	            
        	            if (pageCount > 1) {
        	            	html += "<ul class='pull-right'>";
            	            var prevPageUrl = result["context"]["pages"]["prev_page_url"];
            	            var nextPageUrl = result["context"]["pages"]["next_page_url"];
            	            var currentPageUrl = result["context"]["pages"]["current_page_url"];
            	            var splittedCurrentPageUrl = currentPageUrl.split('?')[1].split("page=" + currentPage);
            	            
            	            if (prevPageUrl != null) {
            		            var whereAttribute = prevPageUrl.split("&where=")[1].split("&")[0];
            		            prevPageUrl = prevPageUrl.split(whereAttribute)[0] + where + prevPageUrl.split(whereAttribute)[1];
            		        	var whatAttribute = prevPageUrl.split("&what=")[1].split("&")[0];
            		        	prevPageUrl = prevPageUrl.split(whatAttribute)[0] + what + prevPageUrl.split(whatAttribute)[1];
            	            	html += "<li><a data-placement='bottom' href='#' rel='tooltip' data-original-title='" + Globalize.localize("prevPage") + "' onClick='updateSearchResults(\"" + prevPageUrl.split('?')[1] + "\")'><i class='uiIconPrevArrow'></i></a></li>";
            	            }
            	            else {
            	            	html += "<li class='disabled'><a data-placement='bottom' rel='tooltip' data-original-title='" + Globalize.localize("prevPage") + "'><i class='uiIconPrevArrow'></i></a></li>";
            	            }
            	            var min = 1;
            	            var max = pageCount;
            	            var dot1 = -1;
            	            var dot2 = -1;
            	            if (pageCount > 5) {
            	              if (currentPage < 4) {
            	                 max = 3;
            	                 dot1 = 4;
            	              } else if (currentPage >= pageCount - 2) {
            	                 min = pageCount - 2;
            	                 dot1 = min - 1;
            	              } else {
            	                 min = currentPage - 1;
            	                 max = currentPage + 1;
            	                 dot1 = 2;
            	                 dot2 = pageCount - 1;
            	              }
            	            }
            	            var classActive;
            	            for( i = 1 ; i <= pageCount; i++) {
            	                if (i == 1 && min > 1) {
            	                	classActive = currentPage == 1 ? "active" : "";
            	                	html += "<li class='" + classActive + "'><a href='#' onClick='updateSearchResults(\"" + splittedCurrentPageUrl[0] + (splittedCurrentPageUrl[1] != undefined ? "page=1" + splittedCurrentPageUrl[1] : "&page=1") + "\")'>1</a></li>";
            	                }	
            	                else if (i == min) {
            	                	for (j = min; j <= max; j++) {
            	                		classActive = currentPage == j ? "active" : "";
            	                	    html += "<li class='" + classActive + "'><a href='#' onClick='updateSearchResults(\"" + splittedCurrentPageUrl[0] + (splittedCurrentPageUrl[1] != undefined ? "page=" + j + splittedCurrentPageUrl[1] : "&page=" + j) + "\")'>" + j + "</a></li>";
            	                    }
            	                } else if (i == dot1 || i == dot2) {
            	                	html += "<li class='disabled'><a href='#'>...</a></li>";
            	                } else if (i == pageCount && max < pageCount) {
               	                	classActive = currentPage == pageCount ? "active" : "";
            	                	html += "<li class='" + classActive + "'><a href='#' onClick='updateSearchResults(\"" + splittedCurrentPageUrl[0] + (splittedCurrentPageUrl[1] != undefined ? "page=" + pageCount + splittedCurrentPageUrl[1] : "&page=" + pageCount) + "\")'>" + pageCount + "</a></li>";
            	                }
            	            }
            	            if (nextPageUrl != null) {
            	            	var whereAttribute = nextPageUrl.split("&where=")[1].split("&")[0];
            	            	nextPageUrl = nextPageUrl.split(whereAttribute)[0] + where + nextPageUrl.split(whereAttribute)[1];
            			        var whatAttribute = nextPageUrl.split("&what=")[1].split("&")[0];
            			        nextPageUrl = nextPageUrl.split(whatAttribute)[0] + what + nextPageUrl.split(whatAttribute)[1];
            			        html += "<li><a data-placement='bottom' href='#' rel='tooltip' data-original-title='" + Globalize.localize("nextPage") + "' onClick='updateSearchResults(\"" + nextPageUrl.split('?')[1] + "\")'><i class='uiIconNextArrow'></i></a></li>";
            	            }
            	            else {
            	            	html += "<li class='disabled'><a data-placement='bottom' rel='tooltip' data-original-title='" + Globalize.localize("nextPage") + "'><i class='uiIconNextArrow'></i></a></li>";
            	            }
        	            }
        	            html += "</ul><p class='pull-right'><span>" + Globalize.localize("totalPage") + "</span><span class='pagesTotalNumber'>" + pageCount + "</span></p></div>"
                    }
                	html += lrStatHtml; 
                	$("div#searchResults").html(html);
                	var gadgetHeight = document.getElementById("searchForm").offsetHeight; 
                	gadgets.window.adjustHeight(gadgetHeight + 1);
                }
            );
        }
    );
	
}

function xt_click(obj,type,section,page,x1,x2,x3,x4,x5) {             
	var xtImg=new Image(),xtDate=new Date(),xtScr=window.screen,xtNav=window.navigator,xtObj=null;         
	var xtSrc='http://logc258.at.pagesjaunes.fr/hit.xiti?s=540649&s2='+section+'&p='+page+((type=='F')?'':(type=='M')?'&a='+x1+'&m1='+x2+'&m2='+x3+'&m3='+x4+'&m4='+x5:'&clic='+x1)+'&hl='+xtDate.getHours()+'x'+xtDate.getMinutes()+'x'+xtDate.getSeconds();               
	if(parseFloat(xtNav.appVersion)>=4) {
		xtSrc+='&r='+xtScr.width+'x'+xtScr.height+'x'+xtScr.pixelDepth+'x'+xtScr.colorDepth;
	}
	xtImg.src=xtSrc;xtImg.onload=function() {xtImg.onload=null;};    
	if(obj.nodeName!='A') {
		var xelp=obj.parentNode;
		while(xelp) {
			if(xelp.nodeName=='A') {
				xtObj=xelp;break;
			}
		xelp=xelp.parentNode;
		}
	} 
	else {
		xtObj=obj;
	}             
	if(xtObj) {
		xtObj.target=xtObj.target||'_self';
		if(x2&&(type=='C')) {
			xtObj.href=x2;
			if(x3) {
				xtObj.target='_blank';
			}
			else {
				xtObj.target='_self';
			}
		}
		if(!xtkey) {
			if(xtObj.target.toLowerCase()=='_self') {
				setTimeout('self.location.href="'+xtObj.href+'"',500);
				return false;
			} 
			else if(xtObj.target.toLowerCase()=='_top') {
				setTimeout('top.location.href="'+xtObj.href+'"',500);
				return false;
			} 
			else if(xtObj.target.toLowerCase()=='_parent') {
				setTimeout('parent.location.href="'+xtObj.href+'"',500);
				return false;
			}
		}
	} 
	else if(x2&&(type=='C')) {
		if(x3) {
			setTimeout('(window.open("'+x2+'","_blank")).focus();',500);
		} 
		else {
			setTimeout('self.location.href="'+x2+'"',500);
		}
	}
	xtkey=false;
	return true;
}
