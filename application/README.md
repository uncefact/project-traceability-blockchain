# Unece web application

This is the root folder of the Unece web application, here resides the codebase of the frontend and backend server and APIs developed with a serverless technology stack.

## Requirements
- Node `v14.20.0`
- npm `v6.14.0`
- Java `v1.8`
- Docker `v20.10.6+`

## Local Setup
- Backend
  - Start dockerized MySQL
  - Start spring application with `active-profile=local`
- Scripts
  - Run `./generate-client-ts.sh`
- Frontend
  - Run `npm install`
  - Run `npm run start` (on Windows `npm run startWin`)
