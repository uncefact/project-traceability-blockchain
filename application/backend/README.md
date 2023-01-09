# UNECE BC Pilot Tracking - backend

In this folder resides the codebase of the Spring Boot backend server, which handles all the business logic of the web application and communicates with a MySql database

## Start the dev containers

From the folder containing the `.devcontainer` folder, run `devcontainer open` (you need to install it from VS code by running `CTRL + SHIFT + P` > and search for "Install Devcontainer CLI").


## Developers notes
This application leverages lombok to counter java verbosity. 

[Configure it in your IDE for the best dev experience](https://projectlombok.org/setup/intellij)

## Dependencies - MySql dockerized

If you want to start developing with a persistent database, in this folder a `docker-compose.yml` and `application-local.properties` have been provided to make your life easier.


It will start a mysql instance available on port `13306`, user `root`, password `root` and a database called `unece_tracking` already available.


**Please remember to select the proper Spring profile (local).**

```bash
docker compose up -d
``` 

## Credentials
If you start the application using the profile `local` or `docker`, you can login with user `user` and password `user`.

## Basic database loaded
The database starts with a small set of preloaded entities:
- 2 industrial sectors
- 3 roles
- 12 companies
- 5 users respectively associated with the last 5 companies above 
- 14 document types (associated with the different types of trades and certifications)
- 9 assessment types (associated with the different types of certifications)
- 17 processing standards (associated with the different types of trades and certifications)
- 9 process types
- 18 materials associated to 3 companies
- 3 traceability levels
- 3 transparency levels
- 5 standard units
- 5 sustainability criteria
- 9 product categories
- 5 countries


## Utils

Swagger endpoint -> http://localhost:8080/api/swagger-ui/index.html