export const topology = '<?xml version="1.0" encoding="UTF-8"?>\
<model version="1.0.0">\
  <root>\
    <frequency_plan>\
      <spots>\
        <item>\
          <assignments>\
            <gateway_id>0</gateway_id>\
            <sat_id_gw>2</sat_id_gw>\
            <sat_id_st>2</sat_id_st>\
            <forward_regen_level>Transparent</forward_regen_level>\
            <return_regen_level>Transparent</return_regen_level>\
          </assignments>\
          <roll_off>\
            <forward>0.350000</forward>\
            <return>0.200000</return>\
          </roll_off>\
          <forward_band>\
            <item>\
              <symbol_rate>40000000.000000</symbol_rate>\
              <type>ACM</type>\
              <wave_form>1-28</wave_form>\
              <group>Standard</group>\
            </item>\
          </forward_band>\
          <return_band>\
            <item>\
              <symbol_rate>40000000.000000</symbol_rate>\
              <type>DAMA</type>\
              <wave_form>3-12</wave_form>\
              <group>Standard</group>\
            </item>\
          </return_band>\
        </item>\
      </spots>\
    </frequency_plan>\
    <st_assignment>\
      <defaults>\
        <default_gateway>0</default_gateway>\
        <default_group>Standard</default_group>\
      </defaults>\
      <assignments/>\
    </st_assignment>\
    <wave_forms>\
      <dvb_s2>\
        <item>\
          <id>1</id>\
          <modulation>QPSK</modulation>\
          <coding>1/4</coding>\
          <efficiency>0.490000</efficiency>\
          <threshold>-2.350000</threshold>\
        </item>\
        <item>\
          <id>2</id>\
          <modulation>QPSK</modulation>\
          <coding>1/3</coding>\
          <efficiency>0.656000</efficiency>\
          <threshold>-1.240000</threshold>\
        </item>\
        <item>\
          <id>3</id>\
          <modulation>QPSK</modulation>\
          <coding>2/5</coding>\
          <efficiency>0.789000</efficiency>\
          <threshold>-0.300000</threshold>\
        </item>\
        <item>\
          <id>4</id>\
          <modulation>QPSK</modulation>\
          <coding>1/2</coding>\
          <efficiency>0.988000</efficiency>\
          <threshold>1.000000</threshold>\
        </item>\
        <item>\
          <id>5</id>\
          <modulation>QPSK</modulation>\
          <coding>3/5</coding>\
          <efficiency>1.188000</efficiency>\
          <threshold>2.230000</threshold>\
        </item>\
        <item>\
          <id>6</id>\
          <modulation>QPSK</modulation>\
          <coding>2/3</coding>\
          <efficiency>1.322000</efficiency>\
          <threshold>3.100000</threshold>\
        </item>\
        <item>\
          <id>7</id>\
          <modulation>QPSK</modulation>\
          <coding>3/4</coding>\
          <efficiency>1.487000</efficiency>\
          <threshold>4.030000</threshold>\
        </item>\
        <item>\
          <id>8</id>\
          <modulation>QPSK</modulation>\
          <coding>4/5</coding>\
          <efficiency>1.587000</efficiency>\
          <threshold>4.680000</threshold>\
        </item>\
        <item>\
          <id>9</id>\
          <modulation>QPSK</modulation>\
          <coding>5/6</coding>\
          <efficiency>1.655000</efficiency>\
          <threshold>5.180000</threshold>\
        </item>\
        <item>\
          <id>10</id>\
          <modulation>QPSK</modulation>\
          <coding>8/9</coding>\
          <efficiency>1.767000</efficiency>\
          <threshold>6.200000</threshold>\
        </item>\
        <item>\
          <id>11</id>\
          <modulation>QPSK</modulation>\
          <coding>9/10</coding>\
          <efficiency>1.789000</efficiency>\
          <threshold>6.420000</threshold>\
        </item>\
        <item>\
          <id>12</id>\
          <modulation>8PSK</modulation>\
          <coding>3/5</coding>\
          <efficiency>1.780000</efficiency>\
          <threshold>5.500000</threshold>\
        </item>\
        <item>\
          <id>13</id>\
          <modulation>8PSK</modulation>\
          <coding>2/3</coding>\
          <efficiency>1.981000</efficiency>\
          <threshold>6.620000</threshold>\
        </item>\
        <item>\
          <id>14</id>\
          <modulation>8PSK</modulation>\
          <coding>3/4</coding>\
          <efficiency>2.228000</efficiency>\
          <threshold>7.910000</threshold>\
        </item>\
        <item>\
          <id>15</id>\
          <modulation>8PSK</modulation>\
          <coding>5/6</coding>\
          <efficiency>2.479000</efficiency>\
          <threshold>9.350000</threshold>\
        </item>\
        <item>\
          <id>16</id>\
          <modulation>8PSK</modulation>\
          <coding>8/9</coding>\
          <efficiency>2.646000</efficiency>\
          <threshold>10.690000</threshold>\
        </item>\
        <item>\
          <id>17</id>\
          <modulation>8PSK</modulation>\
          <coding>9/10</coding>\
          <efficiency>2.679000</efficiency>\
          <threshold>10.980000</threshold>\
        </item>\
        <item>\
          <id>18</id>\
          <modulation>16APSK</modulation>\
          <coding>2/3</coding>\
          <efficiency>2.637000</efficiency>\
          <threshold>8.970000</threshold>\
        </item>\
        <item>\
          <id>19</id>\
          <modulation>16APSK</modulation>\
          <coding>3/4</coding>\
          <efficiency>2.967000</efficiency>\
          <threshold>10.210000</threshold>\
        </item>\
        <item>\
          <id>20</id>\
          <modulation>16APSK</modulation>\
          <coding>4/5</coding>\
          <efficiency>3.166000</efficiency>\
          <threshold>11.030000</threshold>\
        </item>\
        <item>\
          <id>21</id>\
          <modulation>16APSK</modulation>\
          <coding>5/6</coding>\
          <efficiency>3.300000</efficiency>\
          <threshold>11.610000</threshold>\
        </item>\
        <item>\
          <id>22</id>\
          <modulation>16APSK</modulation>\
          <coding>8/9</coding>\
          <efficiency>3.523000</efficiency>\
          <threshold>12.890000</threshold>\
        </item>\
        <item>\
          <id>23</id>\
          <modulation>16APSK</modulation>\
          <coding>9/10</coding>\
          <efficiency>3.567000</efficiency>\
          <threshold>13.130000</threshold>\
        </item>\
        <item>\
          <id>24</id>\
          <modulation>32APSK</modulation>\
          <coding>3/4</coding>\
          <efficiency>3.703000</efficiency>\
          <threshold>12.730000</threshold>\
        </item>\
        <item>\
          <id>25</id>\
          <modulation>32APSK</modulation>\
          <coding>4/5</coding>\
          <efficiency>3.952000</efficiency>\
          <threshold>13.640000</threshold>\
        </item>\
        <item>\
          <id>26</id>\
          <modulation>32APSK</modulation>\
          <coding>5/6</coding>\
          <efficiency>4.120000</efficiency>\
          <threshold>14.280000</threshold>\
        </item>\
        <item>\
          <id>27</id>\
          <modulation>32APSK</modulation>\
          <coding>8/9</coding>\
          <efficiency>4.398000</efficiency>\
          <threshold>15.690000</threshold>\
        </item>\
        <item>\
          <id>28</id>\
          <modulation>32APSK</modulation>\
          <coding>9/10</coding>\
          <efficiency>4.453000</efficiency>\
          <threshold>16.050000</threshold>\
        </item>\
      </dvb_s2>\
      <dvb_rcs2>\
        <item>\
          <id>3</id>\
          <modulation>QPSK</modulation>\
          <coding>1/3</coding>\
          <efficiency>0.560000</efficiency>\
          <threshold>0.220000</threshold>\
          <burst_length>536 sym</burst_length>\
        </item>\
        <item>\
          <id>4</id>\
          <modulation>QPSK</modulation>\
          <coding>1/2</coding>\
          <efficiency>0.870000</efficiency>\
          <threshold>2.340000</threshold>\
          <burst_length>536 sym</burst_length>\
        </item>\
        <item>\
          <id>5</id>\
          <modulation>QPSK</modulation>\
          <coding>2/3</coding>\
          <efficiency>1.260000</efficiency>\
          <threshold>4.290000</threshold>\
          <burst_length>536 sym</burst_length>\
        </item>\
        <item>\
          <id>6</id>\
          <modulation>QPSK</modulation>\
          <coding>3/4</coding>\
          <efficiency>1.420000</efficiency>\
          <threshold>5.360000</threshold>\
          <burst_length>536 sym</burst_length>\
        </item>\
        <item>\
          <id>7</id>\
          <modulation>QPSK</modulation>\
          <coding>5/6</coding>\
          <efficiency>1.600000</efficiency>\
          <threshold>6.680000</threshold>\
          <burst_length>536 sym</burst_length>\
        </item>\
        <item>\
          <id>8</id>\
          <modulation>8PSK</modulation>\
          <coding>2/3</coding>\
          <efficiency>1.700000</efficiency>\
          <threshold>8.080000</threshold>\
          <burst_length>536 sym</burst_length>\
        </item>\
        <item>\
          <id>9</id>\
          <modulation>8PSK</modulation>\
          <coding>3/4</coding>\
          <efficiency>1.930000</efficiency>\
          <threshold>9.310000</threshold>\
          <burst_length>536 sym</burst_length>\
        </item>\
        <item>\
          <id>10</id>\
          <modulation>8PSK</modulation>\
          <coding>5/6</coding>\
          <efficiency>2.130000</efficiency>\
          <threshold>10.820000</threshold>\
          <burst_length>536 sym</burst_length>\
        </item>\
        <item>\
          <id>11</id>\
          <modulation>16QAM</modulation>\
          <coding>3/4</coding>\
          <efficiency>2.590000</efficiency>\
          <threshold>11.170000</threshold>\
          <burst_length>536 sym</burst_length>\
        </item>\
        <item>\
          <id>12</id>\
          <modulation>16QAM</modulation>\
          <coding>5/6</coding>\
          <efficiency>2.870000</efficiency>\
          <threshold>12.560000</threshold>\
          <burst_length>536 sym</burst_length>\
        </item>\
        <item>\
          <id>13</id>\
          <modulation>QPSK</modulation>\
          <coding>1/3</coding>\
          <efficiency>0.610000</efficiency>\
          <threshold>-0.510000</threshold>\
          <burst_length>1616 sym</burst_length>\
        </item>\
        <item>\
          <id>14</id>\
          <modulation>QPSK</modulation>\
          <coding>1/2</coding>\
          <efficiency>0.930000</efficiency>\
          <threshold>1.710000</threshold>\
          <burst_length>1616 sym</burst_length>\
        </item>\
        <item>\
          <id>15</id>\
          <modulation>QPSK</modulation>\
          <coding>2/3</coding>\
          <efficiency>1.300000</efficiency>\
          <threshold>3.690000</threshold>\
          <burst_length>1616 sym</burst_length>\
        </item>\
        <item>\
          <id>16</id>\
          <modulation>QPSK</modulation>\
          <coding>3/4</coding>\
          <efficiency>1.470000</efficiency>\
          <threshold>4.730000</threshold>\
          <burst_length>1616 sym</burst_length>\
        </item>\
        <item>\
          <id>17</id>\
          <modulation>QPSK</modulation>\
          <coding>5/6</coding>\
          <efficiency>1.640000</efficiency>\
          <threshold>5.940000</threshold>\
          <burst_length>1616 sym</burst_length>\
        </item>\
        <item>\
          <id>18</id>\
          <modulation>8PSK</modulation>\
          <coding>2/3</coding>\
          <efficiency>1.750000</efficiency>\
          <threshold>7.490000</threshold>\
          <burst_length>1616 sym</burst_length>\
        </item>\
        <item>\
          <id>19</id>\
          <modulation>8PSK</modulation>\
          <coding>3/4</coding>\
          <efficiency>1.980000</efficiency>\
          <threshold>8.770000</threshold>\
          <burst_length>1616 sym</burst_length>\
        </item>\
        <item>\
          <id>20</id>\
          <modulation>8PSK</modulation>\
          <coding>5/6</coding>\
          <efficiency>2.190000</efficiency>\
          <threshold>10.230000</threshold>\
          <burst_length>1616 sym</burst_length>\
        </item>\
        <item>\
          <id>21</id>\
          <modulation>16QAM</modulation>\
          <coding>3/4</coding>\
          <efficiency>2.660000</efficiency>\
          <threshold>10.720000</threshold>\
          <burst_length>1616 sym</burst_length>\
        </item>\
        <item>\
          <id>22</id>\
          <modulation>16QAM</modulation>\
          <coding>5/6</coding>\
          <efficiency>2.960000</efficiency>\
          <threshold>12.040000</threshold>\
          <burst_length>1616 sym</burst_length>\
        </item>\
      </dvb_rcs2>\
    </wave_forms>\
    <advanced_settings>\
      <links>\
        <forward_duration>10.000000</forward_duration>\
        <forward_margin>0.000000</forward_margin>\
        <return_duration>26.500000</return_duration>\
        <return_margin>0.000000</return_margin>\
      </links>\
      <schedulers>\
        <burst_length>536 sym</burst_length>\
        <crdsa_frame>3</crdsa_frame>\
        <crdsa_delay>250</crdsa_delay>\
        <pep_allocation>1000</pep_allocation>\
      </schedulers>\
      <timers>\
        <statistics>53</statistics>\
        <synchro>1000</synchro>\
        <acm_refresh>1000</acm_refresh>\
      </timers>\
      <delay>\
        <fifo_size>10000</fifo_size>\
        <delay_timer>1</delay_timer>\
      </delay>\
    </advanced_settings>\
  </root>\
</model>'