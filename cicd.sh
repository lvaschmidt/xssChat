#!/bin/bash
cd /sites/xssChat
git fetch --all #get latest commits
git reset --hard origin/main #jump to latest commit
sudo systemctl restart xsschat.service