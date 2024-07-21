read -p "Enter quizId: " quizId

json=$(cat <<EOF
	{
		"quizId": "$quizId",
		"answers": [0, 2, 2, 1]
	}
EOF
)

curl \
http://localhost:3000/add-answers \
-H "Content-Type: application/json" \
-H "Authorization: $AUTH_TOKEN" \
-d "$json"
