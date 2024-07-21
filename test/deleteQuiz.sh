read -p "Enter quizId: " quizId

json=$(cat <<EOF
{
	"quizId": "$quizId"
}
EOF
)

curl \
http://localhost:3000/delete-quiz \
-X "DELETE" \
-H "Content-Type: application/json" \
-H "Authorization: $AUTH_TOKEN" \
-d "$json" 
