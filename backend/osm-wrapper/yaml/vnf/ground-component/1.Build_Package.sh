#!/bin/bash


osm vnfd-delete ground_component

echo "========================================================================"
echo "Uploading packages"
echo "========================================================================"
osm upload-package ground_component_vnf

echo "========================================================================"
echo "Done"
echo "========================================================================"

