#!/bin/bash


osm vnfd-delete satellite

echo "========================================================================"
echo "Uploading packages"
echo "========================================================================"
osm upload-package satellite_vnf

echo "========================================================================"
echo "Done"
echo "========================================================================"

