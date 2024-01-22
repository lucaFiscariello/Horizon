sudo docker build -t mqtt-publisher /home/ubuntu/marketplace/repo-service/mqtt-publisher/
sudo docker run -it  --network=bridge --name mqtt-publisher mqtt-publisher
