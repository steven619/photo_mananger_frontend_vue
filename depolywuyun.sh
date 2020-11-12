#!/usr/bin/env sh

# 当发生错误时中止脚本
set -e

# 构建

yarn run build:prod
tar cJvf  imf.tar.gz dist
scp -r imf.tar.gz passion@wuyun.pro:/home/passion
rm -rf imf.tar.gz

ssh passion@wuyun.pro 'sudo rm -rf /srv/iotbox_manager_frontend/dist && tar xJvf imf.tar.gz -C /srv/iotbox_manager_frontend && rm -rf xJvf imf.tar.gz && sudo chown -R root:woody /srv/iotbox_manager_frontend'
