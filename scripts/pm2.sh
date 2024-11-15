#!/bin/bash
pm2 ls
cd /var/www/html5
pm2 start npm --name my-npm-app2 -- start
