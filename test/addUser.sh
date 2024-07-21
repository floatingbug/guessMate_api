read -p "Enter name, email and password: " name email password

echo $name $email $password
  
json=$(cat << EOF
{
	"name": "$name",
	"email": "$email",
	"password": "$password"
}
EOF
)

echo $json

curl \
http://localhost:3000/add-user \
-H "Content-Type: application/json" \
-d "$json"
