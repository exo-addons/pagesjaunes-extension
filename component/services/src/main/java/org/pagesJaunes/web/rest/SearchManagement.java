package org.pagesJaunes.web.rest;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import org.exoplatform.services.log.ExoLogger;
import org.exoplatform.services.log.Log;
import org.exoplatform.services.rest.resource.ResourceContainer;
import org.json.JSONObject;

@Path("/searchManagement/")
public class SearchManagement implements ResourceContainer {
	
	private static final Log LOGGER = ExoLogger.getLogger("SearchManagement.class");
	
    @GET
    @Path("getSearchResult/{quoiqui}/{ou}")
    @Produces("application/json")
    public Response  getSearchResult(@PathParam("quoiqui") String quoiqui, @PathParam("ou") String ou) {
    	String url = "http://api.apipagesjaunes.fr/v2/pro/find.json?max=4&what="+ quoiqui + "&where=" + ou + "&app_id=e74d895a&app_key=5050ac249e48f00795c39a06a8af7235";
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
            while ((line = bufferedReadere.readLine()) != null)
            {
            	searchResults.append(line + '\n');
            }
            
            return searchResults.toString();
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        finally
        {
            //close the connection, set all objects to null
            connection.disconnect();
            searchResults = null;
            connection = null;
            bufferedReadere = null;
        }
        return null;
    }
}