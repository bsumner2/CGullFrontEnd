#!/bin/sh


LOCAL_API_ADDR_DEF="const API_ADDR= \"https://localhost:7247\";"

ONLINE_API_ADDR_DEF="const API_ADDR= \"https://cgulls.ddns.net:5911\";"

let line_ct=`wc -l < base/res/scripts/app/global_defs.js`-1
head -n $line_ct  base/res/scripts/app/global_defs.js > base/res/scripts/app/global_defs.tmp

if [[ "$1" == "local" ]]; then
  echo "$LOCAL_API_ADDR_DEF" >> base/res/scripts/app/global_defs.tmp
elif [[ "$1" == "online" ]]; then
  echo "$ONLINE_API_ADDR_DEF" >> base/res/scripts/app/global_defs.tmp
else
  echo -e "\033[1;31m[Error]:\033[0m Specify whether to target API requests toward public URL or private hostname" >> /dev/stderr
  rm base/res/scripts/app/global_defs.tmp
  exit 1
fi

rm base/res/scripts/app/global_defs.js
mv base/res/scripts/app/global_defs.tmp base/res/scripts/app/global_defs.js


cat base/res/scripts/app/global_defs.js
#cd base
#python -m http.server 8000 && cd ..
