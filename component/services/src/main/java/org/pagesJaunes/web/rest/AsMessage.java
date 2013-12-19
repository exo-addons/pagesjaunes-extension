package org.pagesJaunes.web.rest;

public class AsMessage {
	private String type;
	private String espace;
    private String postedMessage;
    
	public AsMessage() {
	}
	
	public AsMessage(String type, String espace, String postedMessage) {
		this.type = type;
		this.espace = espace;
		this.postedMessage = postedMessage;
	}
	
	public String getType() {
		return type;
	}
	
	public void setType(String type) {
		this.type = type;
	}
	
	public String getEspace() {
		return espace;
	}
	
	public void setEspace(String espace) {
		this.espace = espace;
	}
	
	public String getPostedMessage() {
		return postedMessage;
	}
	
	public void setPostedMessage(String postedMessage) {
		this.postedMessage = postedMessage;
	}
}
