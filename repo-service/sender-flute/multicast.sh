#!/bin/bash
clear
echo "Configuring GW as a multicast listener..." 
echo "This configuration only works correctly if the docker or th VM has a bridge named openssand_br and a tap named opensand_tap" 
sleep 1


NAME_DEMON_SCMROUTE="opensand"                  # You can choose any name
IPV4_MCAST_GROUPS_JOIN="233.0.0.1"              # Multicast groups to join
IPV4_MCAST_GROUPS_SUBNET="233.0.0.0/8"          # Multicast Net to join 
IPV4_GW_BR="192.168.63.2"                      #IP associate to opensand_br

# Activate multicast functions in the Linux kernel and start demon
sysctl -w net.ipv4.icmp_echo_ignore_broadcasts=0
smcrouted -i $NAME_DEMON_SCMROUTE 

# join opensand_br in the multicast group
smcroutectl join opensand_br $IPV4_MCAST_GROUPS_JOIN -i $NAME_DEMON_SCMROUTE
smcroutectl add  opensand_br $IPV4_GW_BR $IPV4_MCAST_GROUPS_JOIN opensand_tap -i $NAME_DEMON_SCMROUTE

# Insert an IP route from the gateway to the multicast group
route add -net $IPV4_MCAST_GROUPS_SUBNET dev opensand_br

echo "check if everything is ok" 
route 
ip mroute
