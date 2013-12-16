package org.pagesJaunes.web.rest;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.exoplatform.services.log.ExoLogger;
import org.exoplatform.services.log.Log;
import org.exoplatform.services.rest.resource.ResourceContainer;
import org.exoplatform.social.core.activity.model.ExoSocialActivity;
import org.exoplatform.social.core.activity.model.ExoSocialActivityImpl;
import org.exoplatform.social.core.application.PeopleService;
import org.exoplatform.social.core.identity.model.Identity;
import org.exoplatform.social.core.identity.provider.OrganizationIdentityProvider;
import org.exoplatform.social.core.identity.provider.SpaceIdentityProvider;
import org.exoplatform.social.core.space.spi.SpaceService;
import org.exoplatform.social.webui.Utils;
import org.exoplatform.social.webui.activity.UIDefaultActivity;
import org.json.JSONObject;

@Path("/searchManagement/")
public class SearchManagement implements ResourceContainer {
	private static final Log LOGGER = ExoLogger.getLogger("SearchManagement.class");
	
	private String getData(String url) {
    	HttpURLConnection connection = null;
        StringBuilder searchResults = null;
        URL serverAddress = null;
        BufferedReader bufferedReadere  = null;
        String line = null;
        try {
        	serverAddress = new URL(url);
            //set up out communications stuff
            connection = null;
            //Set up the initial connection
            connection = (HttpURLConnection)serverAddress.openConnection();
            connection.setRequestMethod("GET");
            connection.setDoOutput(true);
            connection.setReadTimeout(10000);
            connection.connect();
            //read the result from the server
            bufferedReadere  = new BufferedReader(new InputStreamReader(connection.getInputStream(), "utf-8"));
            searchResults = new StringBuilder();
            while ((line = bufferedReadere.readLine()) != null) {
            	searchResults.append(line + '\n');
            }
            return searchResults.toString();
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        finally {
            //close the connection, set all objects to null
            connection.disconnect();
            searchResults = null;
            connection = null;
            bufferedReadere = null;
        }
        return null;
    }

	@GET
    @Path("getSearchResults/{serviceUriParams : .+}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getSearchResults(@PathParam("serviceUriParams") String serviceUriParams) {
    	String url = "http://api.apipagesjaunes.fr/v2/pro/find.json?" + serviceUriParams;
    	Response response;
    	String data = getData(url);
		try {
	    	if (data != null) {
	            if (data.equalsIgnoreCase("null")) {
	            	response = Response.status(200).entity(data).build();
	            }
	            else {
	            	JSONObject dataJsonObject = new JSONObject(data);
	                response = Response.status(200).entity(dataJsonObject.toString()).build();
	            }
	        }
	        else {
	            response = Response.status(404).build();
	        }
		} catch (Throwable throwable) {
            LOGGER.error(throwable.toString());
            response = Response.status(500).build();
        }
    	return response;
    }
	
	@POST
    @Path("shareSearchResult")
	@Consumes(MediaType.APPLICATION_JSON)
    public Response shareSearchResult(@Context HttpServletRequest request, AsMessage asMessage) {
		String espace = asMessage.getEspace();
		if (espace != null ) {
			Identity spaceIdentity = Utils.getIdentityManager().getOrCreateIdentity(SpaceIdentityProvider.NAME, espace, false);
		    ExoSocialActivity activity = new ExoSocialActivityImpl(Utils.getUserIdentity(request.getRemoteUser(), false).getId(), SpaceService.SPACES_APP_ID, asMessage.getPostedMessage(), null);
		    activity.setType(UIDefaultActivity.ACTIVITY_TYPE);
		    Utils.getActivityManager().saveActivityNoReturn(spaceIdentity, activity);
		}
		else {
			Identity ownerIdentity = Utils.getIdentityManager().getOrCreateIdentity(OrganizationIdentityProvider.NAME, request.getRemoteUser(), false);
		    ExoSocialActivity activity = new ExoSocialActivityImpl(Utils.getUserIdentity(request.getRemoteUser(), false).getId(), PeopleService.PEOPLE_APP_ID, asMessage.getPostedMessage(), null);
		    activity.setType(UIDefaultActivity.ACTIVITY_TYPE);
		    Utils.getActivityManager().saveActivityNoReturn(ownerIdentity, activity);
		}
		return Response.ok().entity("OK").build();
    }
}