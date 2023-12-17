from flask import Flask, jsonify, request
import yaml
import json
import copy
from jsonpath_ng import jsonpath, parse
from NsdBuilder import NSDBuilder 
from NstBuilder import NSTBuilder 

app = Flask(__name__)

def set_value(d, keys,value,isElementOfArray=False):
    json = d

    for i in range(len(keys)):

        if i == len(keys)-1:
            if isElementOfArray:

                if keys[i] in json and json[keys[i]]!=None :
                    json[keys[i]].append(value)
                else:
                    json[keys[i]]=[value]

            else:
                json[keys[i]]=value


            return

        json=json[keys[i]]

def get_value(d, keys):
    json = d

    for i in range(len(keys)):
        json=json[keys[i]]

    return json


######################## PATH TEMPLATE ########################
PATH_TEMPLATE = '../yaml/template/nsd/template.yaml'
PATH_TEMPLATE_SAPD = '../yaml/template/nsd/template-sapd.yaml'
PATH_TEMPLATE_DF = '../yaml/template/nsd/template-df.yaml'
PATH_TEMPLATE_VL_PROFILE = '../yaml/template/nsd/template-vlp.yaml'
PATH_TEMPLATE_VNF_PROFILE = '../yaml/template/nsd/template-df-vnf.yaml'
PATH_TEMPLATE_VNF_NETMNG = '../yaml/template/nsd/template-vnf-netmng.yaml'


PATH_TEMPLATE_NST = '../yaml/template/nst/template.yaml'
PATH_TEMPLATE_NST_SUBNET = '../yaml/template/nst/template-netslice-subnet.yaml'
PATH_TEMPLATE_NST_VLD = '../yaml/template/nst/template-netslice-vld.yaml'
PATH_TEMPLATE_NST_CP = '../yaml/template/nst/template-nst-nss-cp.yaml'

PATH_NS_GW_ST = '../yaml/ns/ns-gw-st.yaml'
PATH_NS_SAT = '../yaml/ns/ns-satellite.yaml'

######################## PATH ELEMENT YAML ########################
DESCRIPTION_PATH = ["nsd", "nsd",0,"description"]

SAPD_PATH = ["nsd", "nsd",0,"sapd"]
SAPD_PATH_ID = ["nsd", "nsd",0,"sapd",0,"id"]
SAPD_PATH_VLD = ["nsd", "nsd",0,"sapd",0,"virtual-link-desc"]

DF_PATH = ["nsd", "nsd",0,"df"]

VL_PROFILE_PATH = ["nsd", "nsd",0,"df",0,"virtual-link-profile"]
VLP_ID_PATH = ["nsd", "nsd",0,"df",0,"virtual-link-profile",0,"id"]
VLP_VLD_PATH = ["nsd", "nsd",0,"df",0,"virtual-link-profile",0,"virtual-link-desc-id"]
VLP_VLD_CIDR = ["nsd", "nsd",0,"df",0,"virtual-link-profile",0,"virtual-link-protocol-data","l3-protocol-data","cidr"]

VNF_PROFILE_PATH = ["nsd", "nsd",0,"df",0,"vnf-profile"]
VNF_PROFILE_ID_PATH = ["nsd", "nsd",0,"df",0,"vnf-profile",0,"id"]
VNF_NET_PATH = ["nsd", "nsd",0,"df",0,"vnf-profile",0,"virtual-link-connectivity"]
VNFD_ID_PATH = ["nsd", "nsd",0,"df",0,"vnf-profile",0,"vnfd-id"]
VNF_CPD_ELEMENT_PATH = ["nsd", "nsd",0,"df",0,"vnf-profile",0,"virtual-link-connectivity",0,"constituent-cpd-id",0,"constituent-base-element-id"]
VNF_CPD_ID_PATH = ["nsd", "nsd",0,"df",0,"vnf-profile",0,"virtual-link-connectivity",0,"constituent-cpd-id",0,"constituent-cpd-id"]
VNF_VLP_ID_PATH = ["nsd", "nsd",0,"df",0,"vnf-profile",0,"virtual-link-connectivity",0,"virtual-link-profile-id"]

ID_PATH = ["nsd", "nsd",0,"id"]
NAME_PATH = ["nsd", "nsd",0,"name"]
VERSION_PATH = ["nsd", "nsd",0,"version"]
VNF_NS_ID_PATH = ["nsd", "nsd",0,"vnf-id"]
VLD_NS_PATH = ["nsd", "nsd",0,"virtual-link-desc"]

ID_NST_PATH = ["nst", 0,"id"]
NAME_NST_PATH = ["nst", 0,"name"]
NST_SUBNET_PATH = ["nst", 0,"netslice-subnet"]
NST_SUBNET_ID_PATH = ["nst", 0,"netslice-subnet",0,"id"]
NST_SUBNET_DESC_PATH = ["nst", 0,"netslice-subnet",0,"description"]
NST_SUBNET_NSREF_PATH = ["nst", 0,"netslice-subnet",0,"nsd-ref"]
NST_VLD_PATH = ["nst", 0,"netslice-vld"]
NST_VLD_PATH_ID = ["nst", 0,"netslice-vld",0,"id"]
NST_VLD_PATH_NAME = ["nst", 0,"netslice-vld",0,"name"]
NST_VLD_PATH_MNG = ["nst", 0,"netslice-vld",0,"mgmt-network"]
NST_VLD_CP_PATH = ["nst", 0,"netslice-vld",0,"nss-connection-point-ref"]
NST_VLD_CP_NS_PATH = ["nst", 0,"netslice-vld",0,"nss-connection-point-ref",0,"nss-ref"]
NST_VLD_CP_NSDCP_PATH = ["nst", 0,"netslice-vld",0,"nss-connection-point-ref",0,"nsd-connection-point-ref"]


######################## POS ARRAY YAML ########################
SAPD_POS = 4
VLP_POS = 6
VNF_NET_POS = 6
VNF_CONSTITUENT_POS = 8
NET_SLICE_SUB_POS = 3
NST_VLD_POS = 3
NST_VLD_CP_POS = 5


######################## LETTURA TEMPLATE YAML ########################
with open(PATH_TEMPLATE, 'r') as yaml_file:
    template_yaml = yaml.safe_load(yaml_file)
    json_template = json.dumps(template_yaml, indent=2)
    json_template = json.loads(json_template)

with open(PATH_TEMPLATE_SAPD, 'r') as yaml_file:
    template_sapd_yaml = yaml.safe_load(yaml_file)
    json_template_sapd = json.dumps(template_sapd_yaml, indent=2)
    json_template_sapd = json.loads(json_template_sapd)

with open(PATH_TEMPLATE_DF, 'r') as yaml_file:
    template_df_yaml = yaml.safe_load(yaml_file)
    json_template_df = json.dumps(template_df_yaml, indent=2)
    json_template_df = json.loads(json_template_df)

with open(PATH_TEMPLATE_VL_PROFILE, 'r') as yaml_file:
    template_vlp_yaml = yaml.safe_load(yaml_file)
    json_template_vlp = json.dumps(template_vlp_yaml, indent=2)
    json_template_vlp = json.loads(json_template_vlp)

with open(PATH_TEMPLATE_VNF_PROFILE, 'r') as yaml_file:
    template_vnf_yaml = yaml.safe_load(yaml_file)
    json_template_vnf = json.dumps(template_vnf_yaml, indent=2)
    json_template_vnf = json.loads(json_template_vnf)

with open(PATH_TEMPLATE_VNF_NETMNG, 'r') as yaml_file:
    template_vnf_netmng_yaml = yaml.safe_load(yaml_file)
    json_template_vnf_netmng = json.dumps(template_vnf_netmng_yaml, indent=2)
    json_template_vnf_netmng = json.loads(json_template_vnf_netmng)



with open(PATH_TEMPLATE_NST, 'r') as yaml_file:
    template_nst_yaml = yaml.safe_load(yaml_file)
    json_template_nst = json.dumps(template_nst_yaml, indent=2)
    json_template_nst = json.loads(json_template_nst)

with open(PATH_TEMPLATE_NST_SUBNET, 'r') as yaml_file:
    template_nst_subnet_yaml = yaml.safe_load(yaml_file)
    json_template_nst_subnet = json.dumps(template_nst_subnet_yaml, indent=2)
    json_template_nst_subnet = json.loads(json_template_nst_subnet)

with open(PATH_TEMPLATE_NST_VLD, 'r') as yaml_file:
    template_nst_vld_yaml = yaml.safe_load(yaml_file)
    json_template_nst_vld = json.dumps(template_nst_vld_yaml, indent=2)
    json_template_nst_vld = json.loads(json_template_nst_vld)

with open(PATH_TEMPLATE_NST_CP, 'r') as yaml_file:
    template_nst_cp_yaml = yaml.safe_load(yaml_file)
    json_template_nst_cp = json.dumps(template_nst_cp_yaml, indent=2)
    json_template_nst_cp = json.loads(json_template_nst_cp)



@app.route('/nsd/<string:project>', methods=['GET'])
def create_ns(project):

    # Creazione descrizione 
    set_value(json_template, DESCRIPTION_PATH, "Description")

    # Creazione sapd 
    SAPD_PATH_ID[SAPD_POS]=0
    SAPD_PATH_VLD[SAPD_POS]=0
    set_value(json_template, SAPD_PATH, copy.deepcopy(json_template_sapd),isElementOfArray=True)
    set_value(json_template, SAPD_PATH_ID, "nsd_cp_mgmt")
    set_value(json_template, SAPD_PATH_VLD, "test")

    SAPD_PATH_ID[SAPD_POS]=1
    SAPD_PATH_VLD[SAPD_POS]=1
    set_value(json_template, SAPD_PATH, copy.deepcopy(json_template_sapd),isElementOfArray=True)
    set_value(json_template, SAPD_PATH_ID, "nsd_cp_data1")
    set_value(json_template, SAPD_PATH_VLD, "datanet1")

    SAPD_PATH_ID[SAPD_POS]=2
    SAPD_PATH_VLD[SAPD_POS]=2
    set_value(json_template, SAPD_PATH, copy.deepcopy(json_template_sapd),isElementOfArray=True)
    set_value(json_template, SAPD_PATH_ID, "nsd_cp_data2")
    set_value(json_template, SAPD_PATH_VLD, "datanet2")

    SAPD_PATH_ID[SAPD_POS]=3
    SAPD_PATH_VLD[SAPD_POS]=3
    set_value(json_template, SAPD_PATH, copy.deepcopy(json_template_sapd),isElementOfArray=True)
    set_value(json_template, SAPD_PATH_ID, "nsd_cp_data3")
    set_value(json_template, SAPD_PATH_VLD, "datanet3")

    # Creazione DF
    set_value(json_template, DF_PATH,json_template_df, isElementOfArray=True )

    VLP_ID_PATH[VLP_POS] = 0
    VLP_VLD_PATH[VLP_POS] = 0
    VLP_VLD_CIDR[VLP_POS] = 0
    set_value(json_template, VL_PROFILE_PATH,copy.deepcopy(json_template_vlp), isElementOfArray=True )
    set_value(json_template, VLP_ID_PATH, "vlp-datanet1" )
    set_value(json_template, VLP_VLD_PATH, "datanet1" )
    set_value(json_template, VLP_VLD_CIDR, "192.168.10.0/24" )

    VLP_ID_PATH[VLP_POS] = 1
    VLP_VLD_PATH[VLP_POS] = 1
    VLP_VLD_CIDR[VLP_POS] = 1
    set_value(json_template, VL_PROFILE_PATH,copy.deepcopy(json_template_vlp), isElementOfArray=True )
    set_value(json_template, VLP_ID_PATH, "vlp-datanet2" )
    set_value(json_template, VLP_VLD_PATH, "datanet2" )
    set_value(json_template, VLP_VLD_CIDR, "192.168.20.0/24" )

    VLP_ID_PATH[VLP_POS] = 2
    VLP_VLD_PATH[VLP_POS] = 2
    VLP_VLD_CIDR[VLP_POS] = 2
    set_value(json_template, VL_PROFILE_PATH,copy.deepcopy(json_template_vlp), isElementOfArray=True )
    set_value(json_template, VLP_ID_PATH, "vlp-datanet3" )
    set_value(json_template, VLP_VLD_PATH, "datanet3" )
    set_value(json_template, VLP_VLD_CIDR, "192.168.30.0/24" )

    # Creazione VNF 1
    VNF_NET_PATH[VNF_NET_POS]=0
    VNFD_ID_PATH[VNF_NET_POS]=0
    VNF_PROFILE_ID_PATH[VNF_NET_POS] = 0
    set_value(json_template, VNF_PROFILE_PATH, copy.deepcopy(json_template_vnf), isElementOfArray=True )
    set_value(json_template, VNFD_ID_PATH,"ubuntu_4ifaces-vnf" )
    set_value(json_template, VNF_PROFILE_ID_PATH,"vnf1" )

    VNF_CPD_ELEMENT_PATH[VNF_CONSTITUENT_POS]=0
    VNF_CPD_ID_PATH[VNF_CONSTITUENT_POS]=0
    VNF_VLP_ID_PATH[VNF_CONSTITUENT_POS] = 0
    set_value(json_template, VNF_NET_PATH,copy.deepcopy(json_template_vnf_netmng), isElementOfArray=True )
    set_value(json_template, VNF_CPD_ELEMENT_PATH,"vnf1" )
    set_value(json_template, VNF_CPD_ID_PATH,"vnf-mgmt-ext" )
    set_value(json_template, VNF_VLP_ID_PATH,"test" )

    VNF_CPD_ELEMENT_PATH[VNF_CONSTITUENT_POS]=1
    VNF_CPD_ID_PATH[VNF_CONSTITUENT_POS]=1
    VNF_VLP_ID_PATH[VNF_CONSTITUENT_POS] = 1
    set_value(json_template, VNF_NET_PATH,copy.deepcopy(json_template_vnf_netmng), isElementOfArray=True )
    set_value(json_template, VNF_CPD_ELEMENT_PATH,"vnf1" )
    set_value(json_template, VNF_CPD_ID_PATH,"vnf-data1-ext" )
    set_value(json_template, VNF_VLP_ID_PATH,"datanet1" )

    VNF_CPD_ELEMENT_PATH[VNF_CONSTITUENT_POS]=2
    VNF_CPD_ID_PATH[VNF_CONSTITUENT_POS]=2
    VNF_VLP_ID_PATH[VNF_CONSTITUENT_POS] = 2
    set_value(json_template, VNF_NET_PATH,copy.deepcopy(json_template_vnf_netmng), isElementOfArray=True )
    set_value(json_template, VNF_CPD_ELEMENT_PATH,"vnf1" )
    set_value(json_template, VNF_CPD_ID_PATH,"vnf-data2-ext" )
    set_value(json_template, VNF_VLP_ID_PATH,"datanet2" )

    VNF_CPD_ELEMENT_PATH[VNF_CONSTITUENT_POS]=3
    VNF_CPD_ID_PATH[VNF_CONSTITUENT_POS]=3
    VNF_VLP_ID_PATH[VNF_CONSTITUENT_POS] = 3
    set_value(json_template, VNF_NET_PATH,copy.deepcopy(json_template_vnf_netmng), isElementOfArray=True )
    set_value(json_template, VNF_CPD_ELEMENT_PATH,"vnf1" )
    set_value(json_template, VNF_CPD_ID_PATH,"vnf-data3-ext" )
    set_value(json_template, VNF_VLP_ID_PATH,"datanet3" )

    # Creazione VNF 2
    VNF_NET_PATH[VNF_NET_POS]=1
    VNFD_ID_PATH[VNF_NET_POS]=1
    VNF_PROFILE_ID_PATH[VNF_NET_POS] = 1
    set_value(json_template, VNF_PROFILE_PATH,copy.deepcopy(json_template_vnf), isElementOfArray=True )
    set_value(json_template, VNFD_ID_PATH,"ubuntu_4ifaces-vnf" )
    set_value(json_template, VNF_PROFILE_ID_PATH,"vnf2" )

    VNF_CPD_ELEMENT_PATH[VNF_NET_POS]=1
    VNF_CPD_ID_PATH[VNF_NET_POS]=1
    VNF_VLP_ID_PATH[VNF_NET_POS] = 1
    VNF_CPD_ELEMENT_PATH[VNF_CONSTITUENT_POS]=0
    VNF_CPD_ID_PATH[VNF_CONSTITUENT_POS]=0
    VNF_VLP_ID_PATH[VNF_CONSTITUENT_POS] = 0
    set_value(json_template, VNF_NET_PATH,copy.deepcopy(json_template_vnf_netmng), isElementOfArray=True )
    set_value(json_template, VNF_CPD_ELEMENT_PATH,"vnf2" )
    set_value(json_template, VNF_CPD_ID_PATH,"vnf-mgmt-ext" )
    set_value(json_template, VNF_VLP_ID_PATH,"test" )

    VNF_CPD_ELEMENT_PATH[VNF_NET_POS]=1
    VNF_CPD_ID_PATH[VNF_NET_POS]=1
    VNF_VLP_ID_PATH[VNF_NET_POS] = 1
    VNF_CPD_ELEMENT_PATH[VNF_CONSTITUENT_POS]=1
    VNF_CPD_ID_PATH[VNF_CONSTITUENT_POS]=1
    VNF_VLP_ID_PATH[VNF_CONSTITUENT_POS] = 1
    set_value(json_template, VNF_NET_PATH,copy.deepcopy(json_template_vnf_netmng), isElementOfArray=True )
    set_value(json_template, VNF_CPD_ELEMENT_PATH,"vnf2" )
    set_value(json_template, VNF_CPD_ID_PATH,"vnf-data1-ext" )
    set_value(json_template, VNF_VLP_ID_PATH,"datanet1" )

    VNF_CPD_ELEMENT_PATH[VNF_NET_POS]=1
    VNF_CPD_ID_PATH[VNF_NET_POS]=1
    VNF_VLP_ID_PATH[VNF_NET_POS] = 1
    VNF_CPD_ELEMENT_PATH[VNF_CONSTITUENT_POS]=2
    VNF_CPD_ID_PATH[VNF_CONSTITUENT_POS]=2
    VNF_VLP_ID_PATH[VNF_CONSTITUENT_POS] = 2
    set_value(json_template, VNF_NET_PATH,copy.deepcopy(json_template_vnf_netmng), isElementOfArray=True )
    set_value(json_template, VNF_CPD_ELEMENT_PATH,"vnf2" )
    set_value(json_template, VNF_CPD_ID_PATH,"vnf-data2-ext" )
    set_value(json_template, VNF_VLP_ID_PATH,"datanet2" )

    VNF_CPD_ELEMENT_PATH[VNF_CONSTITUENT_POS]=3
    VNF_CPD_ID_PATH[VNF_CONSTITUENT_POS]=3
    VNF_VLP_ID_PATH[VNF_CONSTITUENT_POS] = 3
    set_value(json_template, VNF_NET_PATH,copy.deepcopy(json_template_vnf_netmng), isElementOfArray=True )
    set_value(json_template, VNF_CPD_ELEMENT_PATH,"vnf2" )
    set_value(json_template, VNF_CPD_ID_PATH,"vnf-data3-ext" )
    set_value(json_template, VNF_VLP_ID_PATH,"datanet3" )

    # INFO NS
    test = "test"
    data1 = "data1"
    data2 = "data2"
    data3 = "data3"

    set_value(json_template, ID_PATH,"ubuntu_4ifaces-ns" )
    set_value(json_template, NAME_PATH,"ubuntu_4ifaces-ns" )
    set_value(json_template, VERSION_PATH,1.0)
    set_value(json_template, VNF_NS_ID_PATH,"ubuntu_4ifaces-vnf",isElementOfArray=True)

    set_value(json_template, VLD_NS_PATH,{"id":test,"mgmt-network":True},isElementOfArray=True)
    set_value(json_template, VLD_NS_PATH,{"id":data1},isElementOfArray=True)
    set_value(json_template, VLD_NS_PATH,{"id":data2},isElementOfArray=True)
    set_value(json_template, VLD_NS_PATH,{"id":data3},isElementOfArray=True)

    yaml_string = yaml.dump(json_template, default_flow_style=False,default_style='')
    with open('output.yaml', 'w') as file:
        file.write(yaml_string)

    return jsonify({'project': json_template})

@app.route('/nst/<string:project>', methods=['GET'])
def create_nst(project):

    # Creazione descrizione NST 
    set_value(json_template_nst, ID_NST_PATH, "slice_basic_nst")
    set_value(json_template_nst, NAME_NST_PATH, "slice_basic_nst")


    # netslice-subnet
    NST_SUBNET_ID_PATH[NET_SLICE_SUB_POS] =0
    NST_SUBNET_DESC_PATH[NET_SLICE_SUB_POS] =0
    NST_SUBNET_NSREF_PATH[NET_SLICE_SUB_POS] =0
    set_value(json_template_nst, NST_SUBNET_PATH, copy.deepcopy(json_template_nst_subnet),isElementOfArray=True)
    set_value(json_template_nst, NST_SUBNET_ID_PATH,"slice_nsd_1")
    set_value(json_template_nst, NST_SUBNET_DESC_PATH,"desc")
    set_value(json_template_nst, NST_SUBNET_NSREF_PATH,"ubuntu_4ifaces")

    NST_SUBNET_ID_PATH[NET_SLICE_SUB_POS] =1
    NST_SUBNET_DESC_PATH[NET_SLICE_SUB_POS] =1
    NST_SUBNET_NSREF_PATH[NET_SLICE_SUB_POS] =1
    set_value(json_template_nst, NST_SUBNET_PATH, copy.deepcopy(json_template_nst_subnet),isElementOfArray=True)
    set_value(json_template_nst, NST_SUBNET_ID_PATH,"slice_nsd_2")
    set_value(json_template_nst, NST_SUBNET_DESC_PATH,"desc1")
    set_value(json_template_nst, NST_SUBNET_NSREF_PATH,"clone_ubuntu_4ifaces")

    # netslice-vld
    # -- netslice-vld numero 0
    NST_VLD_PATH_ID[NST_VLD_POS] =0 
    NST_VLD_PATH_NAME[NST_VLD_POS] =0 
    NST_VLD_PATH_MNG[NST_VLD_POS] =0 
    set_value(json_template_nst,NST_VLD_PATH, copy.deepcopy(json_template_nst_vld),isElementOfArray=True)
    set_value(json_template_nst,NST_VLD_PATH_NAME, "slice_vld_mgmt" )
    set_value(json_template_nst,NST_VLD_PATH_ID, "slice_vld_mgmt" )
    set_value(json_template_nst,NST_VLD_PATH_MNG, True )

    
    # --- nss-connection-point 0
    NST_VLD_CP_PATH[NST_VLD_POS] = 0
    set_value(json_template_nst,NST_VLD_CP_PATH, copy.deepcopy(json_template_nst_cp),isElementOfArray=True)
    
    NST_VLD_CP_NS_PATH[NST_VLD_POS]=0
    NST_VLD_CP_NS_PATH[NST_VLD_CP_POS]=0
    set_value(json_template_nst,NST_VLD_CP_NS_PATH, "slice_nsd_1")

    NST_VLD_CP_NSDCP_PATH[NST_VLD_POS]=0
    NST_VLD_CP_NSDCP_PATH[NST_VLD_CP_POS]=0
    set_value(json_template_nst,NST_VLD_CP_NSDCP_PATH, "nsd_cp_mgmt")

    # --- nss-connection-point 1
    NST_VLD_CP_PATH[NST_VLD_POS] = 0
    set_value(json_template_nst,NST_VLD_CP_PATH, copy.deepcopy(json_template_nst_cp),isElementOfArray=True)
    
    NST_VLD_CP_NS_PATH[NST_VLD_POS]=0
    NST_VLD_CP_NS_PATH[NST_VLD_CP_POS]=1
    set_value(json_template_nst,NST_VLD_CP_NS_PATH, "slice_nsd_2")

    NST_VLD_CP_NSDCP_PATH[NST_VLD_POS]=0
    NST_VLD_CP_NSDCP_PATH[NST_VLD_CP_POS]=1
    set_value(json_template_nst,NST_VLD_CP_NSDCP_PATH, "nsd_cp_mgmt")









    # -- netslice-vld numero 1
    NST_VLD_PATH_ID[NST_VLD_POS] =1 
    NST_VLD_PATH_NAME[NST_VLD_POS] =1
    NST_VLD_PATH_MNG[NST_VLD_POS] =1 
    set_value(json_template_nst,NST_VLD_PATH, copy.deepcopy(json_template_nst_vld),isElementOfArray=True)
    set_value(json_template_nst,NST_VLD_PATH_NAME, "slice_vld_data1" )
    set_value(json_template_nst,NST_VLD_PATH_ID, "slice_vld_data1" )
    set_value(json_template_nst,NST_VLD_PATH_MNG, False )

    
    # --- nss-connection-point 0
    NST_VLD_CP_PATH[NST_VLD_POS] = 1
    set_value(json_template_nst,NST_VLD_CP_PATH, copy.deepcopy(json_template_nst_cp),isElementOfArray=True)
    
    NST_VLD_CP_NS_PATH[NST_VLD_POS]=1
    NST_VLD_CP_NS_PATH[NST_VLD_CP_POS]=0
    set_value(json_template_nst,NST_VLD_CP_NS_PATH, "slice_nsd_1")

    NST_VLD_CP_NSDCP_PATH[NST_VLD_POS]=1
    NST_VLD_CP_NSDCP_PATH[NST_VLD_CP_POS]=0
    set_value(json_template_nst,NST_VLD_CP_NSDCP_PATH, "nsd_cp_data")

    # --- nss-connection-point 1
    NST_VLD_CP_PATH[NST_VLD_POS] = 1
    set_value(json_template_nst,NST_VLD_CP_PATH, copy.deepcopy(json_template_nst_cp),isElementOfArray=True)
    
    NST_VLD_CP_NS_PATH[NST_VLD_POS]=1
    NST_VLD_CP_NS_PATH[NST_VLD_CP_POS]=1
    set_value(json_template_nst,NST_VLD_CP_NS_PATH, "slice_nsd_2")

    NST_VLD_CP_NSDCP_PATH[NST_VLD_POS]=1
    NST_VLD_CP_NSDCP_PATH[NST_VLD_CP_POS]=1
    set_value(json_template_nst,NST_VLD_CP_NSDCP_PATH, "nsd_cp_data")





    # -- netslice-vld numero 2
    NST_VLD_PATH_ID[NST_VLD_POS] =2
    NST_VLD_PATH_NAME[NST_VLD_POS] =2
    NST_VLD_PATH_MNG[NST_VLD_POS] =2 
    set_value(json_template_nst,NST_VLD_PATH, copy.deepcopy(json_template_nst_vld),isElementOfArray=True)
    set_value(json_template_nst,NST_VLD_PATH_NAME, "slice_vld_data2" )
    set_value(json_template_nst,NST_VLD_PATH_ID, "slice_vld_data2" )
    set_value(json_template_nst,NST_VLD_PATH_MNG, False )

    
    # --- nss-connection-point 0
    NST_VLD_CP_PATH[NST_VLD_POS] = 2
    set_value(json_template_nst,NST_VLD_CP_PATH, copy.deepcopy(json_template_nst_cp),isElementOfArray=True)
    
    NST_VLD_CP_NS_PATH[NST_VLD_POS]=2
    NST_VLD_CP_NS_PATH[NST_VLD_CP_POS]=0
    set_value(json_template_nst,NST_VLD_CP_NS_PATH, "slice_nsd_1")

    NST_VLD_CP_NSDCP_PATH[NST_VLD_POS]=2
    NST_VLD_CP_NSDCP_PATH[NST_VLD_CP_POS]=0
    set_value(json_template_nst,NST_VLD_CP_NSDCP_PATH, "nsd_cp_data2")

    # --- nss-connection-point 1
    NST_VLD_CP_PATH[NST_VLD_POS] = 2
    set_value(json_template_nst,NST_VLD_CP_PATH, copy.deepcopy(json_template_nst_cp),isElementOfArray=True)
    
    NST_VLD_CP_NS_PATH[NST_VLD_POS]=2
    NST_VLD_CP_NS_PATH[NST_VLD_CP_POS]=1
    set_value(json_template_nst,NST_VLD_CP_NS_PATH, "slice_nsd_2")

    NST_VLD_CP_NSDCP_PATH[NST_VLD_POS]=2
    NST_VLD_CP_NSDCP_PATH[NST_VLD_CP_POS]=1
    set_value(json_template_nst,NST_VLD_CP_NSDCP_PATH, "nsd_cp_data2")


    yaml_string = yaml.dump(json_template_nst, default_flow_style=False,default_style='')
    with open('output_NST.yaml', 'w') as file:
        file.write(yaml_string)

    return jsonify({'project': json_template_nst})

@app.route('/test/<string:project>', methods=['GET'])
def test(project):
    nsdBuilder = NSDBuilder()
    nsdBuilder.set_description("ciao")

    nsdBuilder.add_sapd("nsd_cp_mgmt","test",0)
    nsdBuilder.add_sapd("nsd_cp_data","datanet1",1)
    nsdBuilder.add_sapd("nsd_cp_data2","datanet2",2)
    nsdBuilder.add_sapd("nsd_cp_data3","datanet3",3)

    nsdBuilder.add_df()
    nsdBuilder.add_vlp("vlp-datanet1","datanet1", "192.168.10.0/24",0)
    nsdBuilder.add_vlp("vlp-datanet2","datanet2", "192.168.20.0/24",1)
    nsdBuilder.add_vlp("vlp-datanet3","datanet3", "192.168.30.0/24",2)

    nsdBuilder.add_vnf("vnf1","ubuntu_4ifaces",0)
    nsdBuilder.add_vlc_on_vnf("vnf1","vnf-mgmt-ext","test",      num_cpd=0, num_vnf=0)
    nsdBuilder.add_vlc_on_vnf("vnf1","vnf-data1-ext","datanet1", num_cpd=1, num_vnf=0)
    nsdBuilder.add_vlc_on_vnf("vnf1","vnf-data2-ext","datanet2", num_cpd=2, num_vnf=0)
    nsdBuilder.add_vlc_on_vnf("vnf1","vnf-data3-ext","datanet3", num_cpd=3, num_vnf=0)

    nsdBuilder.set_id_ns("ubuntu_4ifaces-ns")
    nsdBuilder.set_name_ns("ubuntu_4ifaces-ns")
    nsdBuilder.set_versione_ns(1.0)
    nsdBuilder.add_vnf_id_inside_ns("ubuntu_4ifaces-vnf")

    nsdBuilder.add_vld_id_inside_ns("test",mng_net=True)
    nsdBuilder.add_vld_id_inside_ns("data1")
    nsdBuilder.add_vld_id_inside_ns("data2")
    nsdBuilder.add_vld_id_inside_ns("data3")


    return jsonify({'project': nsdBuilder.build()})

@app.route('/testnst/<string:project>', methods=['GET'])
def test_nst(project):
    nstBuilder = NSTBuilder()
    nstBuilder.set_id_nst("slice_basic_nst")
    nstBuilder.set_name_nst("slice_basic_nst")

    nstBuilder.add_nst_subnet("slice_nsd_1","desc","ubuntu_4ifaces",0)
    nstBuilder.add_nst_subnet("slice_nsd_2","desc","ubuntu_4ifaces",1)
    
    nstBuilder.add_nst_vld("slice_vld_mgmt","slice_vld_mgmt",0,mng_net=True)
    nstBuilder.add_nst_nss_cp("slice_nsd_1","nsd_cp_mgmt",num_vld=0,num_cp=0)
    nstBuilder.add_nst_nss_cp("slice_nsd_2","nsd_cp_mgmt",num_vld=0,num_cp=1)

    nstBuilder.add_nst_vld("slice_vld_data1","slice_vld_data1",1,mng_net=True)
    nstBuilder.add_nst_nss_cp("slice_nsd_1","nsd_cp_data",num_vld=1,num_cp=0)
    nstBuilder.add_nst_nss_cp("slice_nsd_2","nsd_cp_data",num_vld=1,num_cp=1)

    nstBuilder.add_nst_vld("slice_vld_data2","slice_vld_data2",2,mng_net=True)
    nstBuilder.add_nst_nss_cp("slice_nsd_1","nsd_cp_data2",num_vld=2,num_cp=0)
    nstBuilder.add_nst_nss_cp("slice_nsd_2","nsd_cp_data2",num_vld=2,num_cp=1)

    nstBuilder.add_nst_vld("slice_vld_data3","slice_vld_data3",3,mng_net=True)
    nstBuilder.add_nst_nss_cp("slice_nsd_1","nsd_cp_data3",num_vld=3,num_cp=0)
    nstBuilder.add_nst_nss_cp("slice_nsd_2","nsd_cp_data3",num_vld=3,num_cp=1)


 
    return jsonify({'project': nstBuilder.build()})

@app.route('/osm-wrapper/ns/gw-st/template', methods=['POST'])
def create_ns_by_default():

    req = request.get_json()

    nsdBuilder = NSDBuilder(modify_default=True)
    nsdBuilder.set_ip_vnf_vlc(req.get('ip'),0,1)
    nsdBuilder.set_id_ns(req.get('nameEntity'))
    nsdBuilder.set_name_ns(req.get('nameEntity'))

    return jsonify({'ns': nsdBuilder.build()})



if __name__ == '__main__':
    app.run(debug=True,port=3005)
