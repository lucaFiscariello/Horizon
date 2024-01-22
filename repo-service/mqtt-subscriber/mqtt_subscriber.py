import paho.mqtt.client as mqtt

broker_address = "192.168.63.2"  # Nome del container MQTT broker

def on_message(client, userdata, message):
    print(f"Received message '{message.payload}' on topic '{message.topic}'")

client = mqtt.Client("Subscriber")
client.on_message = on_message

client.connect(broker_address)
client.subscribe("test/topic")

print("sottoscrizione")

client.loop_forever()
