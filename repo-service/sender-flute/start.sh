$PATH_SERVICE/repo-service/sender-flute/multicast.sh
$PATH_SERVICE/repo-service/sender-flute/multicast.sh
sudo apt-get update
sudo apt-get install python3-pip
pip install flute-alc
python3 $PATH_SERVICE/repo-service/sender-flute/app.py & 
echo $! > $PATH_SERVICE/repo-service/sender-flute/pid 
