read -p "Enter answersId: " answersId

json=$(cat <<EOF
{
	"answersId": "$answersId",
	"guesses": [2, 2, 1, 1]
}
EOF
)

curl \
http://localhost:3000/add-guess \
-H "Content-Type: application/json" \
-H "Authorization: $AUTH_TOKEN" \
-d "$json" 
