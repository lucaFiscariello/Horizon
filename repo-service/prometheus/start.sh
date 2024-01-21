$PATH_SERVICE/repo-service/prometheus/node_exporter --collector.systemd --collector.processes & 
echo $! > $PATH_SERVICE/repo-service/prometheus/pid 