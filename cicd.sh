#!/bin/bash
cd /sites/xssChat
git fetch --all #get latest commits
git reset --hard origin/main #jump to latest commit
npm install #install dependencies
sudo systemctl daemon-reload
sudo systemctl restart xsschat.service