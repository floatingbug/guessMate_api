json=$(cat << EOF
{
	"quizTitle": "This is the quiz title",
	"quiz": [
		{
			"question": "question 1",
			"answers": [
				"answer 1",
				"answer 2",
				"answer 3",
				"answer 4"
			]
		},
		{
			"question": "question 1",
			"answers": [
				"answer 1",
				"answer 2",
				"answer 3",
				"answer 4"
			]
		},
		{
			"question": "question 1",
			"answers": [
				"answer 1",
				"answer 2",
				"answer 3",
				"answer 4"
			]
		},
		{
			"question": "question 1",
			"answers": [
				"answer 1",
				"answer 2",
				"answer 3",
				"answer 4"
			]
		}
	]
}
EOF
)

curl -X "POST" \
-H "Content-Type: application/json" \
-H "Authorization: $AUTH_TOKEN" \
-d "$json" \
http://localhost:3000/add-quiz
