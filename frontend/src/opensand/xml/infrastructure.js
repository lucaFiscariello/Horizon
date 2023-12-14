export const infrastructure = '<?xml version="1.0" encoding="UTF-8"?>\
<model version="1.0.0">\
  <root>\
    <entity>\
      <entity_type>Satellite</entity_type>\
      <entity_sat>\
        <entity_id>2</entity_id>\
        <emu_address>192.168.0.1</emu_address>\
        <isl_settings/>\
      </entity_sat>\
      <entity_gw>\
        <entity_id>0</entity_id>\
        <emu_address>192.168.0.3</emu_address>\
        <tap_iface>opensand_tap</tap_iface>\
        <mac_address>00:00:00:00:00:01</mac_address>\
      </entity_gw>\
      <entity_gw_net_acc>\
        <entity_id>0</entity_id>\
        <tap_iface>opensand_tap</tap_iface>\
        <mac_address>FF:FF:FF:00:00:01</mac_address>\
        <interconnect_params>\
          <interconnect_address>192.168.1.1</interconnect_address>\
          <interconnect_remote>192.168.1.2</interconnect_remote>\
        </interconnect_params>\
      </entity_gw_net_acc>\
      <entity_gw_phy>\
        <entity_id>0</entity_id>\
        <interconnect_params>\
          <interconnect_address>192.168.1.2</interconnect_address>\
          <interconnect_remote>192.168.1.1</interconnect_remote>\
        </interconnect_params>\
        <emu_address>192.168.0.1</emu_address>\
      </entity_gw_phy>\
      <entity_st>\
        <entity_id>1</entity_id>\
        <emu_address>192.168.0.2</emu_address>\
        <tap_iface>opensand_tap</tap_iface>\
        <mac_address>00:00:00:00:00:02</mac_address>\
      </entity_st>\
    </entity>\
    <logs>\
      <init>\
        <level>warning</level>\
      </init>\
      <lan_adaptation>\
        <level>warning</level>\
      </lan_adaptation>\
      <encap>\
        <level>warning</level>\
      </encap>\
      <dvb>\
        <level>warning</level>\
      </dvb>\
      <physical_layer>\
        <level>warning</level>\
      </physical_layer>\
      <sat_carrier>\
        <level>warning</level>\
      </sat_carrier>\
      <extra_levels/>\
    </logs>\
    <storage>\
      <enable_collector>true</enable_collector>\
      <collector_address>192.168.0.254</collector_address>\
    </storage>\
    <infrastructure>\
      <satellites>\
        <item>\
          <entity_id>2</entity_id>\
          <emu_address>192.168.0.1</emu_address>\
        </item>\
      </satellites>\
      <gateways>\
        <item>\
          <entity_id>0</entity_id>\
          <emu_address>192.168.0.3</emu_address>\
          <mac_address>00:00:00:00:00:01</mac_address>\
        </item>\
      </gateways>\
      <terminals>\
        <item>\
          <entity_id>1</entity_id>\
          <emu_address>192.168.0.2</emu_address>\
          <mac_address>00:00:00:00:00:02</mac_address>\
        </item>\
      </terminals>\
      <default_gw>0</default_gw>\
    </infrastructure>\
  </root>\
</model>\
'