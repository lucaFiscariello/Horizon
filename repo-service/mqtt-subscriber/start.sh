sudo docker build -t mqtt-subscriber /home/ubuntu/marketplace/repo-service/mqtt-subscriber/
sudo docker run -it  --network=bridge --name mqtt-subscriber mqtt-subscriber
