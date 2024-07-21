read -p "Enter answersIds: " answersIds

json=$(cat <<EOF
{
	"answersIds": $answersIds
}
EOF
)

curl \
http://localhost:3000/get-answers \
-H "Content-Type: application/json" \
-d "$json"
