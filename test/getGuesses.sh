read -p "Enter guessIds: " guessIds

json=$(cat << EOF
{
	"guessIds": $guessIds
}
EOF
)

curl \
http://localhost:3000/get-guesses \
-H "Content-Type: application/json" \
-d "$json"
