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
package org.pagesJaunes.web.rest;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
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

import org.exoplatform.container.ExoContainerContext;
import org.exoplatform.forum.service.Category;
import org.exoplatform.forum.service.Forum;
import org.exoplatform.forum.service.ForumService;
import org.exoplatform.forum.service.MessageBuilder;
import org.exoplatform.forum.service.Topic;
import org.exoplatform.services.jcr.RepositoryService;
import org.exoplatform.services.jcr.config.RepositoryConfigurationException;
import org.exoplatform.services.jcr.core.ManageableRepository;
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
import org.jboss.util.property.PropertyManager;
import org.json.JSONObject;

@Path("/searchManagement/")
public class SearchManagement implements ResourceContainer {
	private static final String APP_ID = "app.id";
	private static final String APP_KEY = "app.key";
	private static final String CATEGORY_ID = "category.id";
	private static final String CATEGORY_NAME = "category.name";
	private static final String CATEGORY_OWNER = "category.owner";
	private static final String CATEGORY_DESCRIPTION = "category.description";
	private static final String ENTREPRISE_ADDRESS = "entreprise.address";
	private static final String FORUM_ID = "forum.id";
	private static final String FORUM_NAME = "forum.name";
	private static final String FORUM_OWNER = "forum.owner";
	private static final String FORUM_DESCRIPTION = "forum.description";
	private static final String INSTALL_STAT_NODE = "installStat";
	private static final String INSTALL_STAT_NODETYPE = "exo:InstallStat";
	private static final Log LOGGER = ExoLogger.getLogger("SearchManagement.class");
	private static final String REPOSITORY = "repository";
	private static final String SYSTEM_WORKSPACE = "system";
	
	
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
    @Path("addInstallStatNode")
    public String addInstallStatNode() {
		try {
			RepositoryService repositoryService = (RepositoryService) ExoContainerContext.getCurrentContainer().getComponentInstanceOfType(RepositoryService.class);
			ManageableRepository manageableRepository;
			manageableRepository = repositoryService.getRepository(REPOSITORY);
			Session session = manageableRepository.getSystemSession(SYSTEM_WORKSPACE);
			Node rootNode = (Node)session.getRootNode();
			if (rootNode.hasNode("installStat")) {
				return "false";
			}
			else {
				rootNode.addNode(INSTALL_STAT_NODE, INSTALL_STAT_NODETYPE);
				session.save();
				return "true";
			}
		} catch (RepositoryException e) {
			e.printStackTrace();
		} catch (RepositoryConfigurationException e) {
			e.printStackTrace();
		}
    	return null;
    }
	
	@POST
    @Path("addTopic")
	@Consumes(MediaType.APPLICATION_JSON)
    public Response addTopic(@Context HttpServletRequest request, ForumTopic forumTopic) {
	    try {
	    	ForumService forumService = (ForumService) ExoContainerContext.getCurrentContainer().getComponentInstanceOfType(ForumService.class);
	    	String categoryId = PropertyManager.getProperty(CATEGORY_ID);
	    	String categoryName = PropertyManager.getProperty(CATEGORY_NAME);
	    	Category category = forumService.getCategory(categoryId);
	    	if (category ==  null) {
	    		category = new Category(categoryId);
		    	category.setCategoryName(categoryName);
		    	category.setOwner(PropertyManager.getProperty(CATEGORY_OWNER));
		    	category.setDescription(PropertyManager.getProperty(CATEGORY_DESCRIPTION));
				forumService.saveCategory(category, true);
	    	}
	    	String forumId = PropertyManager.getProperty(FORUM_ID);
	    	String forumName = PropertyManager.getProperty(FORUM_NAME);
	    	Forum forum = forumService.getForum(categoryId, forumId);
	    	if (forum ==  null) {
	    		forum = new Forum();
	    		forum.setId(forumId);
	    		forum.setForumName(forumName);
	    		forum.setOwner(PropertyManager.getProperty(FORUM_OWNER));
	    		forum.setDescription(PropertyManager.getProperty(FORUM_DESCRIPTION));
				forumService.saveForum(categoryId, forum, true);
	    	}
	    	Topic topic = new Topic();
	    	topic.setTopicName(forumTopic.getTitre());
	    	topic.setOwner(request.getRemoteUser());
	    	topic.setDescription(forumTopic.getMessage());
	    	topic.setIcon("uiIconForumTopic uiIconForumLightGray");
	    	forumService.saveTopic(categoryId, forumId, topic, true, false, new MessageBuilder());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return Response.ok().entity("OK").build();
    }

	@GET
    @Path("getSearchResults/{serviceUriParams : .+}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getSearchResults(@PathParam("serviceUriParams") String serviceUriParams) {
		Response response;
		try {
			if (serviceUriParams.split("&where=&").length > 1) {
				serviceUriParams = serviceUriParams.split("&where=&")[0] + "&where=" + PropertyManager.getProperty(ENTREPRISE_ADDRESS) + "&" + serviceUriParams.split("&where=&")[1];
			}
			String whereAttribute = serviceUriParams.split("&where=")[1].split("&")[0];
			serviceUriParams = serviceUriParams.split(whereAttribute)[0] + URLEncoder.encode(whereAttribute, "utf-8") + serviceUriParams.split(whereAttribute)[1];
			String whatAttribute = serviceUriParams.split("&what=")[1].split("&")[0];
			if (!whatAttribute.equals("")){
				serviceUriParams = serviceUriParams.split(whatAttribute)[0] + URLEncoder.encode(whatAttribute, "utf-8") + serviceUriParams.split(whatAttribute)[1];
			}
			serviceUriParams += "&app_id=" + PropertyManager.getProperty(APP_ID) + "&app_key=" +  PropertyManager.getProperty(APP_KEY);
	    	String url = "http://api.apipagesjaunes.fr/v2/pro/find.json?" + serviceUriParams;
	    	String data = getData(url);
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
		String type = asMessage.getType();
		if (type.equals("space") && espace != null ) {
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