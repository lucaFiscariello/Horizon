from flask import Flask, jsonify, request
import yaml
import json
import copy
from jsonpath_ng import jsonpath, parse
from NsdBuilder import NSDBuilder 
from NstBuilder import NSTBuilder 

app = Flask(__name__)


@app.route('/osm-wrapper/ns/gw-st/template', methods=['POST'])
def create_ns_by_default():

    NUM_VNF = 0
    NUM_NET_DATA1 = 1
    req = request.get_json()

    nsdBuilder = NSDBuilder(modify_default=True)
    nsdBuilder.set_ip_vnf_vlc(req.get('ip'),NUM_VNF,NUM_NET_DATA1)
    nsdBuilder.set_id_ns(req.get('nameEntity'))
    nsdBuilder.set_name_ns(req.get('nameEntity'))
    nsdBuilder.set_cidr_vlp(req.get('cidr'),num_vlp=1)
    nsdBuilder.set_cidr_vlp(req.get('cidr_emulation'),num_vlp=0)
    nsdBuilder.add_vld_vim_net_datanet1(req.get('vim_net'))

    return jsonify({'ns': nsdBuilder.build()})

@app.route('/osm-wrapper/ns/sat/template', methods=['POST'])
def create_ns_sat_by_default():
    
    NUM_VNF = 0
    NUM_NET_DATA1 = 1
    req = request.get_json()

    nsdBuilder = NSDBuilder(modify_default=True , IsSatellite=True)
    nsdBuilder.set_ip_vnf_vlc(req.get('ip'),NUM_VNF,NUM_NET_DATA1)
    nsdBuilder.set_id_ns(req.get('nameEntity'))
    nsdBuilder.set_name_ns(req.get('nameEntity'))
    nsdBuilder.set_cidr_vlp(req.get('cidr'),num_vlp=0)

    return jsonify({'ns': nsdBuilder.build()})

@app.route('/osm-wrapper/ns/node/template', methods=['POST'])
def create_ns_node_by_default():
    
    NUM_VNF = 0
    NUM_NET_DATA1 = 1
    req = request.get_json()

    nsdBuilder = NSDBuilder(modify_default=True , IsSatellite=True)
    nsdBuilder.set_ip_vnf_vlc(req.get('ip'),NUM_VNF,NUM_NET_DATA1)
    nsdBuilder.set_id_ns(req.get('nameEntity'))
    nsdBuilder.set_name_ns(req.get('nameEntity'))
    nsdBuilder.set_cidr_vlp(req.get('cidr'),num_vlp=0)
    nsdBuilder.add_vld_vim_net_datanet1(req.get('vim_net'))


    return jsonify({'ns': nsdBuilder.build()})

@app.route('/osm-wrapper/nst', methods=['POST'])
def create_nst():

    POS_NET_MNG = 0
    POS_NET_DATA1 = 1
    NUM_NET = 0

    slice_name_template = "slice-{}"
    slice_nsd_id_template = "slice_nsd_{}_{}"
    slice_vld_template = "slice_vld_data{}"
    nsd_cp_data_template = "nsd_cp_data{}"

    slice_vld_mgmt = "slice_vld_mgmt"
    slice_vld_data1 = "slice_vld_data1"
    nsd_cp_mng = "nsd_cp_mgmt"
    nsd_cp_data = "nsd_cp_data"

    req = request.get_json()
    name_project = req.get('project')
    entities = req.get('entities')

    nstBuilder = NSTBuilder()
    nstBuilder.set_id_nst(slice_name_template.format(name_project))
    nstBuilder.set_name_nst(slice_name_template.format(name_project))
    NUM_NET = 2

    #netslice-vld mng e data 1
    nstBuilder.add_nst_vld(slice_vld_mgmt,slice_vld_mgmt,POS_NET_MNG,mng_net=True)
    nstBuilder.add_nst_vld(slice_vld_data1,slice_vld_data1,POS_NET_DATA1)

    for i,entity in enumerate(entities):
        
        # netslice-subnet
        id = slice_nsd_id_template.format(name_project,i)
        nsd_ref = entity.get("nameEntity")
        nstBuilder.add_nst_subnet(id,"desc",nsd_ref,num_subnet=i)

        # nss-connection-point-ref mng e data 1
        nstBuilder.add_nst_nss_cp(id,nsd_cp_mng,num_vld=POS_NET_MNG,num_cp=i)
        nstBuilder.add_nst_nss_cp(id,nsd_cp_data,num_vld=POS_NET_DATA1,num_cp=i)

        # nss-connection-point-ref per GW e ST
        if entity.get("type") == "Gateway" or entity.get("type") == "Terminal" :
            nstBuilder.add_nst_vld(slice_vld_template.format(NUM_NET),slice_vld_template.format(NUM_NET),NUM_NET)
            nstBuilder.add_nst_nss_cp(id,nsd_cp_data_template.format(NUM_NET),num_vld=NUM_NET,num_cp=0)
            NUM_NET = NUM_NET+1

    return jsonify({'nst': nstBuilder.build()})


if __name__ == '__main__':
    app.run(debug=True,port=3005)
