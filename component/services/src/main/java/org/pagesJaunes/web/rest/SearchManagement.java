package org.pagesJaunes.web.rest;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;

import org.exoplatform.services.rest.resource.ResourceContainer;

@Path("/searchManagement/")
public class SearchManagement implements ResourceContainer {
	
    @GET
    @Path("getSearchResult/{quoiqui}/{ou}")
    public String  getSearchResult(@PathParam("quoiqui") String quoiqui, @PathParam("ou") String ou) {
    	String url = "http://api.apipagesjaunes.fr/v2/pro/find.json?what="+ quoiqui + "&where=" + ou + "&app_id=e74d895a&app_key=5050ac249e48f00795c39a06a8af7235";
    	return getData(url);
    }
	
    private String getData(String url) {
    	HttpURLConnection connection = null;
    	OutputStreamWriter wr = null;
        BufferedReader rd  = null;
        StringBuilder sb = null;
        String line = null;
        URL serverAddress = null;
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
            rd  = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            sb = new StringBuilder();
            while ((line = rd.readLine()) != null)
            {
                sb.append(line + '\n');
            }
            return sb.toString();
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        finally
        {
            //close the connection, set all objects to null
            connection.disconnect();
            rd = null;
            sb = null;
            wr = null;
            connection = null;
        }
        return null;
    }
}