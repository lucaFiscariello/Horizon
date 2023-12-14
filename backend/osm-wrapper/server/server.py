from flask import Flask, jsonify, request
import yaml
import json
from jsonpath_ng import jsonpath, parse

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
PATH_TEMPLATE = '../yaml/template/template.yaml'
PATH_TEMPLATE_SAPD = '../yaml/template/template-sapd.yaml'
PATH_TEMPLATE_DF = '../yaml/template/template-df.yaml'
PATH_TEMPLATE_VL_PROFILE = '../yaml/template/template-vlp.yaml'
PATH_TEMPLATE_VNF_PROFILE = '../yaml/template/template-df-vnf.yaml'
PATH_TEMPLATE_VNF_NETMNG = '../yaml/template/template-vnf-netmng.yaml'

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
VNF_NET_PATH = ["nsd", "nsd",0,"df",0,"vnf-profile",0,"virtual-link-connectivity"]
VNFD_ID_PATH = ["nsd", "nsd",0,"df",0,"vnf-profile",0,"vnfd-id"]

######################## POS ARRAY YAML ########################
SAPD_POS = 4
VLP_POS = 6
VNF_NET_POS = 6

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



@app.route('/nsd/<string:project>', methods=['GET'])
def get_tasks(project):

    # Creazione descrizione 
    set_value(json_template, DESCRIPTION_PATH, "Description")

    # Creazione sapd 
    SAPD_PATH_ID[SAPD_POS]=0
    SAPD_PATH_VLD[SAPD_POS]=0
    set_value(json_template, SAPD_PATH, json_template_sapd.copy(),isElementOfArray=True)
    set_value(json_template, SAPD_PATH_ID, "nsd_cp_mgmt")
    set_value(json_template, SAPD_PATH_VLD, "test")

    SAPD_PATH_ID[SAPD_POS]=1
    SAPD_PATH_VLD[SAPD_POS]=1
    set_value(json_template, SAPD_PATH, json_template_sapd.copy(),isElementOfArray=True)
    set_value(json_template, SAPD_PATH_ID, "nsd_cp_data1")
    set_value(json_template, SAPD_PATH_VLD, "datanet1")

    SAPD_PATH_ID[SAPD_POS]=2
    SAPD_PATH_VLD[SAPD_POS]=2
    set_value(json_template, SAPD_PATH, json_template_sapd.copy(),isElementOfArray=True)
    set_value(json_template, SAPD_PATH_ID, "nsd_cp_data2")
    set_value(json_template, SAPD_PATH_VLD, "datanet2")

    SAPD_PATH_ID[SAPD_POS]=3
    SAPD_PATH_VLD[SAPD_POS]=3
    set_value(json_template, SAPD_PATH, json_template_sapd.copy(),isElementOfArray=True)
    set_value(json_template, SAPD_PATH_ID, "nsd_cp_data3")
    set_value(json_template, SAPD_PATH_VLD, "datanet3")

    # Creazione DF
    set_value(json_template, DF_PATH,json_template_df, isElementOfArray=True )

    VLP_ID_PATH[VLP_POS] = 0
    VLP_VLD_PATH[VLP_POS] = 0
    set_value(json_template, VL_PROFILE_PATH,json_template_vlp.copy(), isElementOfArray=True )
    set_value(json_template, VLP_ID_PATH, "vlp-datanet1" )
    set_value(json_template, VLP_VLD_PATH, "datanet1" )
    set_value(json_template, VLP_VLD_CIDR, "192.168.10.0/24" )

    VLP_ID_PATH[VLP_POS] = 1
    VLP_VLD_PATH[VLP_POS] = 1
    set_value(json_template, VL_PROFILE_PATH,json_template_vlp.copy(), isElementOfArray=True )
    set_value(json_template, VLP_ID_PATH, "vlp-datanet2" )
    set_value(json_template, VLP_VLD_PATH, "datanet2" )
    set_value(json_template, VLP_VLD_CIDR, "192.168.20.0/24" )

    VLP_ID_PATH[VLP_POS] = 2
    VLP_VLD_PATH[VLP_POS] = 2
    set_value(json_template, VL_PROFILE_PATH,json_template_vlp.copy(), isElementOfArray=True )
    set_value(json_template, VLP_ID_PATH, "vlp-datanet3" )
    set_value(json_template, VLP_VLD_PATH, "datanet3" )
    set_value(json_template, VLP_VLD_CIDR, "192.168.30.0/24" )

    # Creazione VNF
    set_value(json_template, VNF_PROFILE_PATH,json_template_vnf.copy(), isElementOfArray=True )
    set_value(json_template, VNF_NET_PATH,json_template_vnf_netmng.copy(), isElementOfArray=True )
    set_value(json_template, VNFD_ID_PATH,"ubuntu_4ifaces-vnf" )


    return jsonify({'project': json_template})


if __name__ == '__main__':
    app.run(debug=True,port=3005)
