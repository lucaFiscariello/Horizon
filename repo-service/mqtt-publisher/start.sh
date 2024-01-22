sudo apt-get update -y
sudo apt-get install mosquitto mosquitto-clients -y
sleep 3
echo -e "allow_anonymous true\nlistener 1883" | sudo tee -a /etc/mosquitto/mosquitto.conf
sudo service mosquitto restart

sleep 3
sudo docker build -t mqtt-publisher /home/ubuntu/marketplace/repo-service/mqtt-publisher/
sudo docker run -it  --network=bridge --name mqtt-publisher  mqtt-publisher
