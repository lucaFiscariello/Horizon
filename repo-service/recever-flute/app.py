import socket
from flute import receiver

tsi = 1
receiver_writer = receiver.ObjectWriterBuilder.new_buffer()
receiver_config = receiver.Config()
udp_endpoint = receiver.UDPEndpoint("224.0.0.1", 12345)
flute_receiver = receiver.Receiver(udp_endpoint, tsi, receiver_writer, receiver_config)

# Esempio di utilizzo
listen_ip = "224.0.0.1"  # Ascolta su tutte le interfacce di rete
listen_port = 12345     # Sostituisci con la porta su cui desideri ascoltare

 # Crea un socket UDP
udp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
listen_address = (listen_ip, listen_port)
udp_socket.bind(listen_address)

print(f"In ascolto su {listen_ip}:{listen_port}")

while True : 
    try:
        # Ricevi i dati dal mittente
        data, sender_address = udp_socket.recvfrom(1024)  # Usa una dimensione di buffer adeguata
        flute_receiver.push(bytes(data))
        print(data)
    except Exception as e:
        print(f"Errore nella ricezione del pacchetto UDP: {e}")
    


