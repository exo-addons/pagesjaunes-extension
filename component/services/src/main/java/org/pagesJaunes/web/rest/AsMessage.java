package org.pagesJaunes.web.rest;

public class AsMessage {
	private String espace;
    private String postedMessage;
    
	public AsMessage() {
	}
	
	public AsMessage(String espace, String postedMessage) {
		this.espace = espace;
		this.postedMessage = postedMessage;
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
