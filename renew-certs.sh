#!/bin/bash
systemctl stop xsschat
certbot renew --dry-run
systemctl start xsschat