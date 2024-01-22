import paho.mqtt.client as mqtt
import time

broker_address = "192.168.63.2"  # Connessione al broker all'interno del container

client = mqtt.Client("Publisher")

client.connect(broker_address)

topic = "test/topic"

while True:
    message = "Hello, World!"
    client.publish(topic, message)
    print(f"Published: {message} to topic: {topic}")
    time.sleep(5)
