from flute import sender, receiver
import socket

def send_udp_packet(destination_ip, destination_port, data):

    udp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    destination_address = (destination_ip, destination_port)

    try:
        udp_socket.sendto(data, destination_address)
    except Exception as e:
        print(f"Errore nell'invio del pacchetto UDP: {e}")
    finally:
        udp_socket.close()

tsi = 1

sender_config = sender.Config()
oti = sender.Oti.new_no_code(1400, 64)
flute_sender = sender.Sender(tsi, oti, sender_config)

buf = bytes(b'hello world')
flute_sender.add_object_from_buffer(buf, "text", "file://hello.txt", None)
flute_sender.publish()

buf = bytes(b'hello world2')
flute_sender.add_object_from_buffer(buf, "text", "file://hello.txt", None)
flute_sender.publish()


while True:
    pkt = flute_sender.read()
    if pkt == None:
        break

    destination_ip = "233.0.0.1"  
    destination_port = 12345    
    body = bytes(pkt) 
    send_udp_packet(destination_ip, destination_port,body )

   
    