import requests
import API_KEY


def aiBot():
    '''
    - Function that recives chatgpt-42 URL.
    - Payload is JSON format for the chatbot with Role and Content. Content will be made by us and is basically the set command that the bot will recive at all times.
    '''


    url = "https://chatgpt-42.p.rapidapi.com/chatgpt"

    payload = {
        "messages": [
            {
                "role": "user", #the status of the user

                #fixa content innan du börjar med allt
                "content": "Take this list and give a recommedations of five movies to watch. Give only the movie titles as recomendations, you response should be in JSON format" #command that the bot will recive when button is interacted with
            }
        ],
        "web_access": False
    }
    headers = {
        "x-rapidapi-key": API_KEY.x_rapidapi_key,
        "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
        "Content-Type": "application/json"
    }

    response = requests.post(url, json=payload, headers=headers)

    print(response.json())





aiBot()