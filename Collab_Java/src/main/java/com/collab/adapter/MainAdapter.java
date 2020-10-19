package com.collab.adapter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.collab")
public class MainAdapter 
{
	public static void main(String [] args)
	{
		SpringApplication.run(MainAdapter.class, args);	
	}
}
