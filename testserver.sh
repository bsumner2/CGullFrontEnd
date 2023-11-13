#!/bin/sh


LOCAL_API_ADDR_DEF="const API_ADDR= \"https://localhost:7247\";"

ONLINE_API_ADDR_DEF="const API_ADDR= \"https://cgulls.ddns.net:5911\";"

rm -f base/res/scripts/app/global_defs.js
cp global_defs.js base/res/scripts/app/


if [[ "$1" == "local" ]]; then
  echo "$LOCAL_API_ADDR_DEF" >> base/res/scripts/app/global_defs.js
elif [[ "$1" == "online" ]]; then
  echo "$ONLINE_API_ADDR_DEF" >> base/res/scripts/app/global_defs.js
else
  echo -e "\033[1;31m[Error]:\033[0m Specify whether to target API requests toward public URL or private hostname" >> /dev/stderr
  exit 1
fi

cd base
python -m http.server 8000 && cd ..

