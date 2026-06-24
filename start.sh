#!/bin/bash
echo "Killing old processes..."
sudo fuser -k 2222/tcp 8080/tcp 2323/tcp 5000/tcp 3000/tcp 2>/dev/null
sleep 2

echo "Starting honeypot..."
nohup python3 -u /home/ubuntu/honeypot.py > /home/ubuntu/honeypot.log 2>&1 &

echo "Starting API..."
nohup python3 -u /home/ubuntu/api.py > /home/ubuntu/api.log 2>&1 &

echo "Starting dashboard..."
cd /home/ubuntu/honeypot-dashboard
nohup npm start > /home/ubuntu/react.log 2>&1 &

echo "All services started. Wait 15 seconds then open http://18.208.224.135:3000"

