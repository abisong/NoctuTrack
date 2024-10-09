import os
import requests

github_token = os.environ.get('GITHUB_TOKEN')
headers = {
    'Authorization': f'token {github_token}',
    'Accept': 'application/vnd.github.v3+json'
}

data = {
    "name": "NoctuTrack",
    "description": "A mobile-friendly NoctuTrack app using Flask and vanilla JavaScript for tracking nocturia and related data",
    "private": False
}

response = requests.post('https://api.github.com/user/repos', json=data, headers=headers)

if response.status_code == 201:
    print("Repository created successfully")
    print(f"Repository URL: {response.json()['html_url']}")
else:
    print(f"Failed to create repository. Status code: {response.status_code}")
    print(f"Response content: {response.json()}")
