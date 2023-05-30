#!/bin/sh

set -eu

mongosh <<EOF
db.createUser(
{
    user: '$MONGO_INITDB_ROOT_USERNAME',
    pwd: '$MONGO_INITDB_ROOT_PASSWORD',
    roles: [
      { role: "readWrite", db: '$MONGO_INITDB_DATABASE' }
    ]
})
db.auth('$MONGO_INITDB_ROOT_USERNAME', '$MONGO_INITDB_ROOT_PASSWORD')
use '$MONGO_INITDB_DATABASE'
db.users.insertOne({"email":"-", "password": "-"})
EOF
