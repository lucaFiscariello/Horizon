export const profile = '<?xml version="1.0" encoding="UTF-8"?>\
<model version="1.0.0">\
  <root>\
    <control_plane>\
      <disable_control_plane>true</disable_control_plane>\
    </control_plane>\
    <network>\
      <gw_fifos>\
        <item>\
          <priority>0</priority>\
          <name>NM</name>\
          <capacity>1000</capacity>\
          <access_type>ACM</access_type>\
        </item>\
        <item>\
          <priority>1</priority>\
          <name>EF</name>\
          <capacity>3000</capacity>\
          <access_type>ACM</access_type>\
        </item>\
        <item>\
          <priority>2</priority>\
          <name>SIG</name>\
          <capacity>1000</capacity>\
          <access_type>ACM</access_type>\
        </item>\
        <item>\
          <priority>3</priority>\
          <name>AF</name>\
          <capacity>2000</capacity>\
          <access_type>ACM</access_type>\
        </item>\
        <item>\
          <priority>4</priority>\
          <name>BE</name>\
          <capacity>6000</capacity>\
          <access_type>ACM</access_type>\
        </item>\
      </gw_fifos>\
      <simulation>None</simulation>\
      <fca>0</fca>\
      <dama_algorithm>Legacy</dama_algorithm>\
      <st_fifos>\
        <item>\
          <priority>0</priority>\
          <name>NM</name>\
          <capacity>1000</capacity>\
          <access_type>DAMA_RBDC</access_type>\
        </item>\
        <item>\
          <priority>1</priority>\
          <name>EF</name>\
          <capacity>3000</capacity>\
          <access_type>DAMA_RBDC</access_type>\
        </item>\
        <item>\
          <priority>2</priority>\
          <name>SIG</name>\
          <capacity>1000</capacity>\
          <access_type>DAMA_RBDC</access_type>\
        </item>\
        <item>\
          <priority>3</priority>\
          <name>AF</name>\
          <capacity>2000</capacity>\
          <access_type>DAMA_RBDC</access_type>\
        </item>\
        <item>\
          <priority>4</priority>\
          <name>BE</name>\
          <capacity>6000</capacity>\
          <access_type>DAMA_RBDC</access_type>\
        </item>\
      </st_fifos>\
      <qos_classes>\
        <item>\
          <pcp>7</pcp>\
          <name>NC</name>\
          <fifo>NM</fifo>\
        </item>\
        <item>\
          <pcp>6</pcp>\
          <name>IC</name>\
          <fifo>SIG</fifo>\
        </item>\
        <item>\
          <pcp>5</pcp>\
          <name>VO</name>\
          <fifo>EF</fifo>\
        </item>\
        <item>\
          <pcp>4</pcp>\
          <name>VI</name>\
          <fifo>AF</fifo>\
        </item>\
        <item>\
          <pcp>3</pcp>\
          <name>CA</name>\
          <fifo>AF</fifo>\
        </item>\
        <item>\
          <pcp>2</pcp>\
          <name>EE</name>\
          <fifo>AF</fifo>\
        </item>\
        <item>\
          <pcp>1</pcp>\
          <name>BK</name>\
          <fifo>BE</fifo>\
        </item>\
        <item>\
          <pcp>0</pcp>\
          <name>BE</name>\
          <fifo>BE</fifo>\
        </item>\
      </qos_classes>\
      <virtual_connections/>\
      <qos_settings>\
        <lan_frame_type>Ethernet</lan_frame_type>\
        <sat_frame_type>Ethernet</sat_frame_type>\
        <default_pcp>0</default_pcp>\
      </qos_settings>\
    </network>\
    <access>\
      <random_access>\
        <saloha_algo>CRDSA</saloha_algo>\
      </random_access>\
      <simulations/>\
      <settings>\
        <category>Standard</category>\
        <dama_enabled>true</dama_enabled>\
        <scpc_enabled>false</scpc_enabled>\
      </settings>\
      <dama>\
        <cra>100</cra>\
        <algorithm>Legacy</algorithm>\
        <duration>23</duration>\
      </dama>\
      <scpc>\
        <carrier_duration>5</carrier_duration>\
      </scpc>\
    </access>\
    <access2>\
      <scpc>\
        <carrier_duration>5</carrier_duration>\
      </scpc>\
    </access2>\
    <encap>\
      <gse>\
        <packing_threshold>3</packing_threshold>\
      </gse>\
      <rle>\
        <alpdu_protection>Sequence Number</alpdu_protection>\
      </rle>\
    </encap>\
    <physical_layer>\
      <uplink_attenuation>\
        <clear_sky>20.000000</clear_sky>\
        <attenuation_type>Ideal</attenuation_type>\
        <ideal_attenuation_value>0.000000</ideal_attenuation_value>\
      </uplink_attenuation>\
      <downlink_attenuation>\
        <clear_sky>20.000000</clear_sky>\
        <attenuation_type>Ideal</attenuation_type>\
        <ideal_attenuation_value>0.000000</ideal_attenuation_value>\
      </downlink_attenuation>\
    </physical_layer>\
    <isl>\
      <delay>10</delay>\
    </isl>\
  </root>\
</model>'