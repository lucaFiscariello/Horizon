FROM python:3.8


RUN pip3 install paho-mqtt

COPY mqtt_publisher.py /app/

CMD ["/bin/sh", "-c", "python3 /app/mqtt_publisher.py"]
