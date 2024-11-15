#!/bin/bash

# Define the PM2 app name
APP_NAME="my-npm-app2"

# Check if the PM2 process exists
if pm2 list | grep -q "$APP_NAME"; then
  echo "Process $APP_NAME exists. Restarting and reloading..."
  pm2 restart "$APP_NAME" --update-env
else
  echo "Process $APP_NAME does not exist. Starting a new process..."
  cd /var/www/html5 || exit
  pm2 start npm --name "$APP_NAME" -- start
fi

# Optional: Show the PM2 process list for verification
pm2 list
