from flask import Flask, request, jsonify, render_template, send_from_directory
from github import Github

app = Flask(__name__)


# Replace these variables with your GitHub repository details
github_username = 'gem-rahulAdhikari'
github_repository = 'selenium_Integartion'
github_personal_access_token = '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'

# Initialize the PyGitHub object with your personal access token
g = Github(github_personal_access_token)
repo = g.get_user(github_username).get_repo(github_repository)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/push', methods=['POST'])
def push_to_github():
    try:
        text = request.json.get('data')
        commit_message = 'Text update from online input'
        file_path = 'src/main/java/App.java'  # Change to the appropriate file path in your repo
        # branch_name = 'selenium' 

        # Get the current contents of the file
        contents = repo.get_contents(file_path)
        sha = contents.sha

        # Update the file with the new text
        repo.update_file(file_path, commit_message, text, sha)

        return jsonify({'message': 'Text pushed to GitHub successfully!'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to push text to GitHub.'}), 500

@app.route('/execute', methods=['POST'])
def execute_selenium_script():
    data = request.json.get('data')
    print(f"Received data from the textarea: {data}")
    return jsonify({'message': 'Data received successfully!'})

# Serve frontend assets (CSS, JS, etc.)
@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
