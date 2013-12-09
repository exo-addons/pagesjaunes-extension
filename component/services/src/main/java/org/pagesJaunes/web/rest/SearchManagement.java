package org.pagesJaunes.web.rest;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Iterator;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;

import org.exoplatform.services.rest.resource.ResourceContainer;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

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
        StringBuilder searchResults = null;
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
            //create ObjectMapper instance
            ObjectMapper objectMapper = new ObjectMapper();
             
            //read JSON like DOM Parser
            JsonNode rootNode = objectMapper.readTree(connection.getInputStream());
            JsonNode contextNode = rootNode.path("context");
            JsonNode searchNode = contextNode.path("search");
            JsonNode whatNode = searchNode.path("what");
            JsonNode whereNode = searchNode.path("where");
            searchResults = new StringBuilder("<h2><b>" + whatNode.asText() + " à " + whereNode.asText() + "</b></h2><br/></br>");
            
            JsonNode searchResultsNode = rootNode.path("search_results");
            JsonNode listingsNode = searchResultsNode.path("listings");
            Iterator<JsonNode> elements = listingsNode.elements();
            JsonNode listingNode;
            JsonNode merchantNameNode;
            JsonNode descriptionNode;
            JsonNode thumbnailUrlNode;
            JsonNode inscriptionsNode;
            JsonNode adressStreetNode;
            while(elements.hasNext()){
            	listingNode = elements.next();
                thumbnailUrlNode = listingNode.path("thumbnail_url");
                searchResults.append("<img src='" + thumbnailUrlNode.asText() + "'/>");
                merchantNameNode = listingNode.path("merchant_name");
                searchResults.append("<h3><b style='text-decoration:underline;'>" + merchantNameNode.asText() + "</b></h3></br>");
                inscriptionsNode = listingNode.path("inscriptions");
                adressStreetNode = inscriptionsNode.path("adress_street");
                searchResults.append("<p style='color:grey;'>" + adressStreetNode.asText() + "</p></br>");
                descriptionNode = listingNode.path("description");
                searchResults.append("<p>" + descriptionNode.asText() + "</p></br>");
                searchResults.append("***********************************************");
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
        }
        return null;
    }
    
//    public static class JsonSearchResult {
//        Context context;
//        SearchResults search_results;
//        
//        public Context getContext() {
//        	return context;
//        }
//        
//        public SearchResults getSearchResults() {
//            return search_results;
//        }
//    }
//    
//    public static class Context {
//        Search search;
//        Results results;
//        Pages pages;
//        
//        public Search getSearch() {
//        	return search;
//        }
//        
//        public Results getResults() {
//            return results;
//        }
//        
//        public Pages getPages() {
//            return pages;
//        }
//    }
//    
//    public static class Search {
//        String what;
//        String where;
//        
//        public String getWhat() {
//        	return what;
//        }
//        
//        public String getWhere() {
//            return where;
//        }
//    }
//    
//    public static class Results {
//        String first_listing;
//        String last_listing;
//        String total_listing;
//        
//        public String getFirstListing() {
//        	return first_listing;
//        }
//        
//        public String getLastListing() {
//            return last_listing;
//        }
//        
//        public String getTotalListing() {
//            return total_listing;
//        }
//    }
//    
//    public static class Pages {
//        String current_page;
//        String page_count;
//        String listings_per_page;
//        String current_page_url;
//        String next_page_url;
//
//        public String getCurrentPage() {
//        	return current_page;
//        }
//        
//        public String getPageCount() {
//            return page_count;
//        }
//        
//        public String getListingsPerPage() {
//            return listings_per_page;
//        }
//        
//        public String getCurrentPageUrl() {
//            return current_page_url;
//        }
//        
//        public String getNextPageUrl() {
//            return next_page_url;
//        }
//    }
//    
//    public static class SearchResults {
//        List<Listings> listings;
//        
//        public List<Listings> getListings() {
//        	return listings;
//        }
//    }
//    
//    public static class Listings {
//        String listing_id;
//        String merchant_id;
//        String merchat_name;
//        String thumbnail_url;
//        String description;
//        List<String> website_urls;
//        boolean eco_label;
//        List<String> categories;
//        Inscriptions inscriptions;
//        
//        public String getListingId() {
//          return listing_id;
//        }
//        
//        public String getMerchantId() {
//            return merchant_id;
//        }
//        
//        public String getMerchantName() {
//            return merchat_name;
//        }
//        
//        public String getThumbnailUrl() {
//            return thumbnail_url;
//        }
//        
//        public String getDescription() {
//            return description;
//        }
//        
//        public List<String> getWebsiteUrls() {
//            return website_urls;
//        }
//        
//        public boolean getEcoLabel() {
//            return eco_label;
//        }
//        
//        public List<String> getCategories() {
//            return categories;
//        }
//        
//        public Inscriptions getInscriptions() {
//            return inscriptions;
//        }
//    }
//    
//    public static class Inscriptions {
//        String inscription_id;
//        String pro_id;
//        String label;
//        String adress_street;
//        String adress_zipcode;
//        String adress_city;
//        String latitude;
//        String longitude;
//        Reviews reviews;
//        ContactInfo contact_info1;
//        ContactInfo contact_info2;
//        
//		public String getInscriptionId() {
//			return inscription_id;
//		}
//		
//		public String getProId() {
//			return pro_id;
//		}
//		
//		public String getLabel() {
//			return label;
//		}
//		
//		public String getAdressStreet() {
//			return adress_street;
//		}
//		public String getAdressZipcode() {
//			return adress_zipcode;
//		}
//		public String getAdressCity() {
//			return adress_city;
//		}
//		public String getLatitude() {
//			return latitude;
//		}
//		public String getLongitude() {
//			return longitude;
//		}
//		public Reviews getReviews() {
//			return reviews;
//		}
//		public ContactInfo getContactInfo1() {
//			return contact_info1;
//		}
//		public ContactInfo getContactInfo2() {
//			return contact_info2;
//		}
//    }
//    
//    public static class Reviews {
//        String total_reviews;
//        String overall_review_rating;
//        
//        public String getTotalReviews() {
//        	return total_reviews;
//        }
//        
//        public String getOverallReviewRating() {
//        	return overall_review_rating;
//        }
//    }
//    
//    public static class ContactInfo {
//        String contact_type;
//        String contact_value;
//        String phone_number_pricing;
//        boolean no_direct_marketing;
//        
//        public String getContactType() {
//            return contact_type;
//        }
//          
//        public String getContactValue() {
//            return contact_value;
//        }
//        
//        public String getPhoneNumberPricing() {
//            return phone_number_pricing;
//        }
//        
//        public boolean getNoDirectMarketing() {
//            return no_direct_marketing;
//        }
//    }
}