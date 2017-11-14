# Waitlist

This is the Waitlist web app.

## Setup

Clone this repository and install dependencies

    npm install

## Run

There are two ways of starting the frontend.
Which one to choose depends on the backend you want to use.
In both cases a Webpack dev-server with the frontend will start and listen on port 3000.

### with local backend

Run

    npm run local

if you have the backend running locally on port 3001.
(`npm run server` will fall back to this.)

### with remote backend

Run

    npm run remote

if you want to use the backend which is deployed on AWS.
