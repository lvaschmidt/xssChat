#!/bin/bash
systemctl stop xsschat
certbot renew
systemctl start xsschat