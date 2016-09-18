#!/bin/bash

####
#  Swap columns 2 and 3 in a file
####
awk ' BEGIN { FS="|"; OFS="|" } { ss=$2
$2=$3
$3=ss
print $0 } ' cleaned-merchant_postal_20100908.txt > cleaned2-merchant_postal_20100908.txt

