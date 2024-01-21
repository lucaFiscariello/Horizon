/home/ubuntu/marketplace/repo-service/recever-flute/multicast.sh
/home/ubuntu/marketplace/repo-service/recever-flute/multicast.sh
sudo apt-get update -y
sudo apt-get install python3-pip -y
pip install flute-alc
python3 /home/ubuntu/marketplace/repo-service/recever-flute/app.py & 
echo $! > /home/ubuntu/marketplace/repo-service/recever-flute/pid 
