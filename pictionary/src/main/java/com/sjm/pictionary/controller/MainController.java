package com.sjm.pictionary.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MainController {
	


	@MessageMapping("/ImageComming")
	 @SendTo("/topic/UpdateImage")
    public Image getMessage(Image message) throws Exception {
		System.out.println("ImageComming");
		
		   return message;
    }
	
	
	
	@MessageMapping("/ResultComming")
	@SendTo("/topic/CheckStatus")
   public Status getRes(ResultWord res) throws Exception {
		Status status = new Status();
		System.out.println("name:" + res.getImageName());
		
		if(res.getImageName().equals( "test" )) {
			status.setCode("OK");
		}else {
			status.setCode("Error");
		}
		
		return status;
		
   }

	@RequestMapping("/login")
	public String login() {
		return "login";
	}
	


}
