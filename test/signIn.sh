#!/bin/bash

read -p "Enter name or email and password: " nameOrEmail password

if [[ "$nameOrEmail" == *"@"* ]]; then
json=$(cat << EOF
{
	"email": "$nameOrEmail",
	"password": "$password"
}
EOF
)
else
json=$(cat << EOF
{
	"name": "$nameOrEmail",
	"password": "$password"
}
EOF
)
fi

echo $json

response=$(
curl -i \
-H "Content-Type: application/json" \
-d "$json" \
http://localhost:3000/sign-in
)

# extract Authorization-Header and cut token
token=$(echo "$response" | grep -i "Authorization:" | sed 's/Authorization: Bearer //I' | tr -d '\r')

# check if token is extracted
if [ -z "$token" ]; then
    echo "Error: Token could not be extracted."
	return 1
fi

# save token to environment variable
export AUTH_TOKEN="$token"

# print token
echo "token is: $AUTH_TOKEN"
