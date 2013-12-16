package org.pagesJaunes.web.rest;

public class AsMessage {
	private String type;
    private String postedMessage;
	public AsMessage() {
	}
	public AsMessage(String type, String postedMessage) {
		this.type = type;
		this.postedMessage = postedMessage;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getPostedMessage() {
		return postedMessage;
	}
	public void setPostedMessage(String postedMessage) {
		this.postedMessage = postedMessage;
	}
}
