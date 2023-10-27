#!/bin/sh

cd base
python -m http.server 8000 &
cd ..
nohup firefox http://localhost:8000 &> /dev/null &
