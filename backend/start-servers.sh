cd backend/geometry-costellation && python3 server.py 
./backend/opensand-wrapper/start-opensand-server.sh 
cd backend/opensand-wrapper && node server.js
cd backend/osm-wrapper/server && python3 server.py 
cd backend/proxy && node server.js 

