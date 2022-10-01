#!/bin/sh

set -e

CONTAINER_NAME=custom-local-mysql

if [[ $(docker ps -a | grep $CONTAINER_NAME) ]];
then
    docker start $CONTAINER_NAME
    echo $'Starting container. \n'
    sleep 5
else
    docker run -d \
        -e 'MYSQL_DATABASE=customdb' \
        -e 'MYSQL_USER=custom-local' \
        -e 'MYSQL_PASSWORD=password' \
        -e 'MYSQL_ROOT_PASSWORD=password' \
        -e 'TZ=Asia/Singapore' \
        -p 3306:3306 \
        --name $CONTAINER_NAME \
        --platform linux/x86_64 \
        mysql:5.7

    echo $'\n[Waiting for mysql db to initialise] \n'
    sleep 25
fi

echo $'[Resetting local db] \n'
# NODE_ENV=local yarn db:reset
