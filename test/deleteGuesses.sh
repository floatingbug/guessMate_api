read -p "Enter guessId: " guessId

json=$(cat << EOF
{
	"guessId": "$guessId"
}
EOF
)

curl \
http://localhost:3000/delete-guesses \
-X "DELETE" \
-H "Content-Type: application/json" \
-H "Authorization: $AUTH_TOKEN" \
-d "$json"
