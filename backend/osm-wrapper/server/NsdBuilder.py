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
PATH_TEMPLATE = '../yaml/template/nsd/template.yaml'
PATH_TEMPLATE_SAPD = '../yaml/template/nsd/template-sapd.yaml'
PATH_TEMPLATE_DF = '../yaml/template/nsd/template-df.yaml'
PATH_TEMPLATE_VL_PROFILE = '../yaml/template/nsd/template-vlp.yaml'
PATH_TEMPLATE_VNF_PROFILE = '../yaml/template/nsd/template-df-vnf.yaml'
PATH_TEMPLATE_VNF_NETMNG = '../yaml/template/nsd/template-vnf-netmng.yaml'

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
VNF_CPD_IP_PATH = ["nsd", "nsd",0,"df",0,"vnf-profile",0,"virtual-link-connectivity",0,"constituent-cpd-id",0,"ip-address"]
VNF_VLP_ID_PATH = ["nsd", "nsd",0,"df",0,"vnf-profile",0,"virtual-link-connectivity",0,"virtual-link-profile-id"]

ID_PATH = ["nsd", "nsd",0,"id"]
NAME_PATH = ["nsd", "nsd",0,"name"]
VERSION_PATH = ["nsd", "nsd",0,"version"]
VNF_NS_ID_PATH = ["nsd", "nsd",0,"vnf-id"]
VLD_NS_PATH = ["nsd", "nsd",0,"virtual-link-desc"]

######################## POS ARRAY YAML ########################
SAPD_POS = 4
VLP_POS = 6
VNF_NET_POS = 6
VNF_CONSTITUENT_POS = 8

######################## LETTURA TEMPLATE YAML ########################

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


    
class NSDBuilder:

    def __init__(self, modify_default=False):
        if modify_default :
            with open(PATH_NS_GW_ST, 'r') as yaml_file:
                template_ns_gw_st = yaml.safe_load(yaml_file)
                json_template_ns_gw_st = json.dumps(template_ns_gw_st, indent=2)
                self.json_template = json.loads(json_template_ns_gw_st)
        else:
            with open(PATH_TEMPLATE, 'r') as yaml_file:
                template_yaml = yaml.safe_load(yaml_file)
                json_template = json.dumps(template_yaml, indent=2)
                self.json_template = json.loads(json_template)

    def set_description(self,description):
        set_value(self.json_template, DESCRIPTION_PATH, description)

    def set_id_ns(self,id):
        set_value(self.json_template, ID_PATH,id)

    def set_name_ns(self,name):
        set_value(self.json_template, NAME_PATH,name)

    def set_versione_ns(self,version):
        set_value(self.json_template, VERSION_PATH,version)

    def add_vnf_id_inside_ns(self,vnf_id):
        set_value(self.json_template, VNF_NS_ID_PATH,vnf_id,isElementOfArray=True)

    def add_vld_id_inside_ns(self,vld_id,mng_net=False):
        if mng_net :
            set_value(self.json_template, VLD_NS_PATH,{"id":vld_id,"mgmt-network":True},isElementOfArray=True)
        else:
            set_value(self.json_template, VLD_NS_PATH,{"id":vld_id},isElementOfArray=True)


    def add_sapd(self,id,virtual_link_desc,num_sapd):
        SAPD_PATH_ID[SAPD_POS]=num_sapd
        SAPD_PATH_VLD[SAPD_POS]=num_sapd
        set_value(self.json_template, SAPD_PATH, copy.deepcopy(json_template_sapd),isElementOfArray=True)
        set_value(self.json_template, SAPD_PATH_ID, id)
        set_value(self.json_template, SAPD_PATH_VLD, virtual_link_desc)

    def add_df(self):
        set_value(json_template, DF_PATH,json_template_df, isElementOfArray=True )

    def add_vlp(self,vlp_id,vlp_vld,cidr,num_vlp):
        VLP_ID_PATH[VLP_POS] = num_vlp
        VLP_VLD_PATH[VLP_POS] = num_vlp
        VLP_VLD_CIDR[VLP_POS] = num_vlp
        set_value(self.json_template, VL_PROFILE_PATH,copy.deepcopy(json_template_vlp), isElementOfArray=True )
        set_value(self.json_template, VLP_ID_PATH, vlp_id )
        set_value(self.json_template, VLP_VLD_PATH, vlp_vld )
        set_value(self.json_template, VLP_VLD_CIDR, cidr )

    def add_vnf(self,vnf_id,vnf_profile_id,num_vnf):
        VNF_NET_PATH[VNF_NET_POS]=num_vnf
        VNFD_ID_PATH[VNF_NET_POS]=num_vnf
        VNF_PROFILE_ID_PATH[VNF_NET_POS] = num_vnf
        set_value(self.json_template, VNF_PROFILE_PATH, copy.deepcopy(json_template_vnf), isElementOfArray=True )
        set_value(self.json_template, VNFD_ID_PATH,vnf_profile_id)
        set_value(self.json_template, VNF_PROFILE_ID_PATH,vnf_id )

    def add_vlc_on_vnf(self,cdp_element,cdp_id,vpl_id,num_cpd,num_vnf):
        VNF_CPD_ELEMENT_PATH[VNF_NET_POS]=num_vnf
        VNF_CPD_ID_PATH[VNF_NET_POS]=num_vnf
        VNF_VLP_ID_PATH[VNF_NET_POS] = num_vnf
        VNF_CPD_ELEMENT_PATH[VNF_CONSTITUENT_POS]=num_cpd
        VNF_CPD_ID_PATH[VNF_CONSTITUENT_POS]=num_cpd
        VNF_VLP_ID_PATH[VNF_CONSTITUENT_POS] = num_cpd

        set_value(self.json_template, VNF_NET_PATH,copy.deepcopy(json_template_vnf_netmng), isElementOfArray=True )
        set_value(self.json_template, VNF_CPD_ELEMENT_PATH,cdp_element )
        set_value(self.json_template, VNF_CPD_ID_PATH,cdp_id )
        set_value(self.json_template, VNF_VLP_ID_PATH,vpl_id )

    def set_ip_vnf_vlc(self,ip,num_vnf,num_cpd):
        VNF_CPD_IP_PATH[VNF_NET_POS] = num_vnf
        VNF_CPD_IP_PATH[VNF_CONSTITUENT_POS]=num_cpd
        set_value(self.json_template, VNF_CPD_IP_PATH,ip)



    def build(self):
        return self.json_template
     

