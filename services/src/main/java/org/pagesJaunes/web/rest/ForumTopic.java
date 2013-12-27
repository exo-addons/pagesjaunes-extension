package org.pagesJaunes.web.rest;

public class ForumTopic {
	private String titre;
    private String message;
    
	public ForumTopic() {
	}
	
	public ForumTopic(String titre, String message) {
		this.titre = titre;
		this.message = message;
	}
	
	public String getTitre() {
		return titre;
	}
	
	public void setTitre(String titre) {
		this.titre = titre;
	}
	
	public String getMessage() {
		return message;
	}
	
	public void setMessage(String message) {
		this.message = message;
	}
}
