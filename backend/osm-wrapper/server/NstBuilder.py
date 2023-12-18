import yaml
import json
import copy
from jsonpath_ng import jsonpath, parse

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
PATH_TEMPLATE_NST = '../yaml/template/nst/template.yaml'
PATH_TEMPLATE_NST_SUBNET = '../yaml/template/nst/template-netslice-subnet.yaml'
PATH_TEMPLATE_NST_VLD = '../yaml/template/nst/template-netslice-vld.yaml'
PATH_TEMPLATE_NST_CP = '../yaml/template/nst/template-nst-nss-cp.yaml'

######################## PATH ELEMENT YAML ########################
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
NET_SLICE_SUB_POS = 3
NST_VLD_POS = 3
NST_VLD_CP_POS = 5

######################## LETTURA TEMPLATE YAML ########################
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

class NSTBuilder:

    def set_id_nst(self,id):
        set_value(json_template_nst, ID_NST_PATH, id)

    def set_name_nst(self,name):
        set_value(json_template_nst, NAME_NST_PATH, name)

    def add_nst_subnet(self,subnet_id,desc,nsd_ref,num_subnet):
        NST_SUBNET_ID_PATH[NET_SLICE_SUB_POS] =num_subnet
        NST_SUBNET_DESC_PATH[NET_SLICE_SUB_POS] =num_subnet
        NST_SUBNET_NSREF_PATH[NET_SLICE_SUB_POS] =num_subnet
        set_value(json_template_nst, NST_SUBNET_PATH, copy.deepcopy(json_template_nst_subnet),isElementOfArray=True)
        set_value(json_template_nst, NST_SUBNET_ID_PATH,subnet_id)
        set_value(json_template_nst, NST_SUBNET_DESC_PATH,desc)
        set_value(json_template_nst, NST_SUBNET_NSREF_PATH,nsd_ref)

    def add_nst_vld(self,vld_id,vld_name,num_vld,mng_net=False):
        NST_VLD_PATH_ID[NST_VLD_POS] =num_vld
        NST_VLD_PATH_NAME[NST_VLD_POS] =num_vld
        NST_VLD_PATH_MNG[NST_VLD_POS] =num_vld
        set_value(json_template_nst,NST_VLD_PATH, copy.deepcopy(json_template_nst_vld),isElementOfArray=True)
        set_value(json_template_nst,NST_VLD_PATH_NAME, vld_id )
        set_value(json_template_nst,NST_VLD_PATH_ID, vld_name )

        if mng_net:
            set_value(json_template_nst,NST_VLD_PATH_MNG, True )

    def add_nst_nss_cp(self,cp_id,cp_nsd_id,num_vld,num_cp):
        NST_VLD_CP_PATH[NST_VLD_POS] = num_vld
        set_value(json_template_nst,NST_VLD_CP_PATH, copy.deepcopy(json_template_nst_cp),isElementOfArray=True)
        
        NST_VLD_CP_NS_PATH[NST_VLD_POS]=num_vld
        NST_VLD_CP_NS_PATH[NST_VLD_CP_POS]=num_cp
        set_value(json_template_nst,NST_VLD_CP_NS_PATH, cp_id)

        NST_VLD_CP_NSDCP_PATH[NST_VLD_POS]=num_vld
        NST_VLD_CP_NSDCP_PATH[NST_VLD_CP_POS]=num_cp
        set_value(json_template_nst,NST_VLD_CP_NSDCP_PATH, cp_nsd_id)


    def build(self):
        return json_template_nst
     

