read -p "Enter answersId: " answersId

json=$(cat <<EOF
{
	"answersId": "$answersId"
}
EOF
)

echo $json

curl http://localhost:3000/delete-answers \
-X "DELETE" \
-H "Content-Type: application/json" \
-H "Authorization: $AUTH_TOKEN" \
-d "$json"
