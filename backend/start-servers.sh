gnome-terminal -- bash -c " cd geometry-costellation && python3 server.py ; read -p "
gnome-terminal -- bash -c "  ./opensand-wrapper/start-opensand-server.sh ; read -p "
gnome-terminal -- bash -c "cd opensand-wrapper && node server.js ; read -p "
gnome-terminal -- bash -c "cd osm-wrapper/server && python3 server.py ; read -p "
gnome-terminal -- bash -c "cd proxy && node server.js ; read -p "

