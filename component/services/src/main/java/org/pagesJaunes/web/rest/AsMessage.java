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
