sudo docker stop mqtt-publisher
sudo docker rm mqtt-publisher
sudo apt-get purge mosquitto mosquitto-clients -y
sudo apt-get autoremove -y

