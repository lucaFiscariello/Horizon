$(PATH_SERVICE)/repo-service/recever-flute/multicast.sh
$(PATH_SERVICE)/repo-service/recever-flute/multicast.sh
sudo apt-get update
sudo apt-get install python3-pip
pip install flute-alc
python3 $(PATH_SERVICE)/repo-service/recever-flute/app.py & 
echo $! > $(PATH_SERVICE)/repo-service/recever-flute/pid 
