read -p "Enter quizIds: " quizIds

json=$(cat <<EOF
{
	"quizIds": $quizIds
}
EOF
)

curl \
http://localhost:3000/get-quizzes \
-H "Content-Type: application/json" \
-d "$json"
