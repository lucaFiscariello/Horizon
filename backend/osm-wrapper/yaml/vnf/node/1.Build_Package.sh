#!/bin/bash


osm vnfd-delete node

echo "========================================================================"
echo "Uploading packages"
echo "========================================================================"
osm upload-package node_vnf

echo "========================================================================"
echo "Done"
echo "========================================================================"

