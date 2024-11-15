#!/bin/bash
pm2 ls
pm2 start npm --name my-npm-app -- start
