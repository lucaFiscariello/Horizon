FROM python:3.8

RUN pip install paho-mqtt

WORKDIR /app

COPY mqtt_subscriber.py .

CMD ["python", "mqtt_subscriber.py"]
