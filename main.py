from flask import Flask, render_template, jsonify,make_response, redirect,url_for, request, g, session, Response
from flask_cors import CORS
from flask_restful import Resource, Api, reqparse, abort
import logging
from datetime import datetime, timedelta,date
from flask_session import Session
import json
import requests
import os
from logging.handlers import RotatingFileHandler
import datetime 
import time
import firebase_admin
from firebase_admin import credentials, db

cred = credentials.Certificate('serviceAccountKey.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://flask-app-b27bb-default-rtdb.firebaseio.com'
})

log_file = datetime.datetime.now().strftime('app_%Y-%m-%d.log')

app = Flask(__name__, static_folder='static')

CORS(app)
api = Api(app)

ip_address='34.136.47.80'

hashMap = { "Python": "Python (3.8.1)", "Java": "Java (OpenJDK 13.0.1)", "C": "C (GCC 9.2.0)"}


logging.basicConfig(filename=log_file,level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

#login logic for admin---------------------

app.secret_key=os.urandom(24)

app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=5)
Session(app)

@app.route('/login')
def login():
    if g.user:
     return redirect(url_for('protected'))
    else:
       return render_template('login.html') 


@app.route('/login',methods=['GET','POST'])
def index():
    session.permanent = True
    if request.method == "POST":
        
        session.pop('user', None)
        session.pop('password', None)
        username=request.form["username"]
        password=request.form["password"]
        url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/admin"
        response = requests.get(url)
        if response.status_code == 200:
           data = response.json();
        for item in data:
          fetchedUsername = item['userId']
          fetchedpassword = item['password']
          
        if(username==fetchedUsername and password==fetchedpassword):
            session['user']=username
            session['password']=password
            return redirect(url_for('protected'))
        else:
            return render_template('error.html') 
        
    return render_template('login.html')    
        

@app.route('/admin')
def protected():
    if g.user:
        data_array = []
        keys_to_display = ['_id','name','url','modified','status']
        url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getSubmissions"
        #url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getSubmission"
        response = requests.get(url)
        if response.status_code == 200:
           data = response.json();
           for item in data:
            fetchedUrl = item['url']
            result = fetchedUrl.split("/")
            print(result)
           
            filtered_item = {k: v for k, v in item.items() if k in keys_to_display}
            data_array.append(filtered_item)
            headers = [k.upper() for k in keys_to_display]  
        return render_template('demo.html', data=data_array,headers=headers)
           
        
    return redirect(url_for('index'))
        


@app.route('/stream')
def stream():
    def event_stream():
        messages = []
        def callback(snapshot):
            messages.append(snapshot.val())
        messagesRef = db.reference('messages')
        messagesRef.order_by_key().limit_to_last(50).on('child_added', callback)
        while True:
            if messages:
                yield 'data: {}\n\n'.format(json.dumps(messages.pop()))
    return Response(event_stream(), mimetype="text/event-stream")


@app.before_request
def before_request():
    
    g.user = None

    if 'user' in session:
           
          g.user = session['user']

    
      

@app.route("/logout", methods=["POST"])
def dropsession():
    session.pop('user', None)
    session.pop('password', None)
    return render_template('login.html')



@app.route("/data")
def get_data():
      data_array = []
      keys_to_display = ['_id','name','url']
      url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getSubmissions"
      response = requests.get(url)
      if response.status_code == 200:
       data = response.json()
       print(type(data))
       for item in data:
         filtered_item = {k: v for k, v in item.items() if k in keys_to_display}
         data_array.append(filtered_item)
       headers = [k.upper() for k in keys_to_display]  
      return render_template('demo.html', data=data_array,headers=headers)
      


@app.route('/updateStatus', methods=['POST'])
def update_status():
    row_id = request.form.get('rowId')
    new_value = request.form.get('newValue')
    url = request.form.get('url')
    print(row_id);
    print(new_value);
    print(url);
    api_url = 'https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/updateStatus'

    payload = {
    'filter': {
      # 'url': 'https://gem-codeeditor.com/user/fbf8f89a27cd8a4e5eb64ee975e97286615461576a5349dc36da5983128859aa'
       'url': url
  
    },
    'status':new_value,
    
    
}

    headers = {
      'Content-Type': 'application/json'
                }

    response = requests.put(api_url, data=json.dumps(payload), headers=headers)

    if response.ok:
         response_data = response.json()
         print(response_data)
    else:
         print(f"Request failed with status code {response.status_code}")

    # Process the data as needed
    # Return a JSON response
    return jsonify({'success': True})
   


#---------------------------------------
@app.route('/')
def home():
    print("hello john")
    return render_template('index.html', logged_in=True)


@app.route('/url')
def url():
   
    return render_template('uniqueUrlGenerator.html')

@app.route('/select_lang', methods=['POST'])
def languageSelection_route():
    Selected_value = request.json.get('Selected_value')
    Selected_option = request.json.get('Selected_option')
    print(Selected_option)
    print(Selected_value)
    logging.info(Selected_option+": "+Selected_value)
    response = requests.get('http://'+ip_address+'/languages/all')
    data = response.json()
    return jsonify(data)   


@app.route('/run', methods=['POST'])
def run_form():
    textarea_value = request.get_json()['textareaValue']
    Selected_value = request.get_json()['Selected_value']
    stdin = request.get_json()['stdin']
    print(Selected_value)
    print(textarea_value)
    print(stdin)
    headers = {
        'Content-Type': 'application/json',
        'X-Auth-Token': 'X-Auth-Token'
    }

    # Create the JSON body for the request
    json_body = {
       'source_code':textarea_value,
       'language_id': Selected_value,
       'stdin': stdin,
       'number_of_runs': None,
       'expected_output': None,
       'cpu_time_limit': None,
       'cpu_extra_time': None,
       'wall_time_limit': None,
       'memory_limit': None,
       'stack_limit': None,
       'max_processes_and_or_threads': None,
       'enable_per_process_and_thread_time_limit':None,
       'enable_per_process_and_thread_memory_limit': None,
       'max_file_size': None,
       'enable_network': None
    }

    # Send the POST request with the headers and JSON body
    response = requests.post('http://'+ip_address+'/submissions', headers=headers, json=json_body)

    data = response.json()
    out=tocken_gen(data['token'])
    logging.info("Code_Output"+":" +out)
    return out

@app.route('/submit', methods=['POST'])
def submit_form():
    today = date.today()
    date_string = today.strftime("%Y-%m-%d")
    textarea_value = request.get_json()['textareaValue']
    Selected_value = request.get_json()['Selected_value']
    input_value = request.get_json()['inputValue']
    output_value = request.get_json()['outputValue']
    stdin = request.get_json()['stdin']
    name = request.get_json()['name']
    print(name)
    print(Selected_value)
    print(textarea_value)
    print(today)
    headers = {
        'Content-Type': 'application/json',
        'X-Auth-Token': 'X-Auth-Token'
    }

    # Create the JSON body for the request
    json_body = {
       'source_code':textarea_value,
       'language_id': Selected_value,
       'stdin': stdin,
       'number_of_runs': None,
       'expected_output': None,
       'cpu_time_limit': None,
       'cpu_extra_time': None,
       'wall_time_limit': None,
       'memory_limit': None,
       'stack_limit': None,
       'max_processes_and_or_threads': None,
       'enable_per_process_and_thread_time_limit':None,
       'enable_per_process_and_thread_memory_limit': None,
       'max_file_size': None,
       'enable_network': None
    }

    # Send the POST request with the headers and JSON body
    response = requests.post('http://'+ip_address+'/submissions', headers=headers, json=json_body)

    data = response.json()
    out=tocken_gen(data['token'])
    logging.info("Code_Output"+":" +out)
    req_url=getUrl(name)
    print("helloooo");
    print(req_url)
    req_name=getName(req_url)
    print("heloo prya")
    print(req_name)
    updateVal(out,req_url,textarea_value,input_value,output_value,date_string)
    
    # use the textarea_value variable as needed
    return out


def tocken_gen(token):
        
          url = 'http://'+ip_address+'/submissions/{}?base64_encoded=false&fields=stdout,stderr,status_id,language_id,source_code'.format(token)
          params = {"base64_encoded": "false", "fields": "stdout,stderr,status_id,language_id,source_code"}
          response = requests.get(url, params=params)
         
          
           
           
        # success, handle the response
          data = response.json()
          while data['status_id'] == 1 or data['status_id'] == 2:
                url = 'http://'+ip_address+'/submissions/{}?base64_encoded=false&fields=stdout,stderr,status_id,language_id,source_code'.format(token)
                params = {"base64_encoded": "false", "fields": "stdout,stderr,status_id,language_id,source_code"}
                response = requests.get(url, params=params)
                data = response.json()
               # print(data['status_id'])

          print(data)

          if data['status_id'] == 4 or data['status_id'] == 5 or data['status_id'] == 6 or data['status_id'] == 7 or data['status_id'] == 8 or data['status_id'] == 9 or data['status_id'] == 10 or data['status_id'] == 11 or data['status_id'] == 12 or data['status_id'] == 13 or data['status_id'] == 14:
               errorStatus=Status(data['status_id'])
               return errorStatus
               
          else :
               if data['stderr'] == None:
                     return data['stdout']
               else :
                    return data['stderr']
              
           
       
         
def Status(StatusId):
     if StatusId == 4:
          error1="Wrong Answer"
          return error1
     elif StatusId == 5:
          error1="Time Limit Exceeded"
          return error1
     elif StatusId == 6:
          error1="Compilation Error"
          return error1
     elif StatusId == 7:
          error1="Runtime Error (SIGSEGV)"
          return error1
     elif StatusId == 8:
          error1="Runtime Error (SIGXFSZ)"
          return error1
     elif StatusId == 9:
          error1="Runtime Error (SIGFPE)"
          return error1
     elif StatusId == 10:
          error1="Runtime Error (SIGABRT)"
          return error1
     elif StatusId == 11:
          error1="Runtime Error (NZEC)"
          return error1
     elif StatusId == 12:
          error1="Runtime Error (Other)"
          return error1
     elif StatusId == 13:
          error1="Internal Error"
          return error1
     elif StatusId == 14:
          error1="Exec Format Error"
          return error1
          

def getUrl(name):
     my_bool = False;
     url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getSubmissions"
     response = requests.get(url)
     if response.status_code == 200:
        data = response.json();
        for item in data:
          fetchedUrl = item['url']
          print( fetchedUrl)
          result = fetchedUrl.split("/")
          print(result)
          my_string = result[-1]
          result1 = my_string.split("=")
          print(result1[-1])
          if result1[-1] == name:
              my_bool=True;
              print("got it")
              return item['url']
         
        print("not find")
        setUrl(name)
        return name      
          
     else:
        raise Exception("Error accessing API: " + response.text)
     


def setUrl(name):
     
     req_url="https://gem-codeeditor.wl.r.appspot.com/?name="+name
     req_name=getName(req_url)
     api_url = 'https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/userSubmissions'

     data = {
    # Replace with your body parameter
    "submissions": [],
    "submittedCode": [],
    "inputArray": [],
    "outputArray": [],
    "name":req_name,
     # "url": "http://127.0.0.1:5000/?name="+name
    "url": "https://gem-codeeditor.wl.r.appspot.com/?name="+name,
     "modified":"",
     "status":"None",
            },
    

     headers = {
         'Content-Type': 'application/json'
           }

     response = requests.post(api_url, headers=headers, data=json.dumps(data))
     response_json = response.json()
     print(response_json)    
    
     
def updateVal(submit_result,name,textarea_value,input_value,output_value,today):
      """
      url = 'https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/updateData'
      payload = {'value': submit_result}
      response = requests.put(url, params=payload)
      logging.info("Submitted_Code : "+submit_result)
      return response.text
      """
      
      api_url = 'https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/updateSubmissions'

      payload = {
    'filter': {
      # 'url': 'https://gem-codeeditor.com/user/fbf8f89a27cd8a4e5eb64ee975e97286615461576a5349dc36da5983128859aa'
       'url': name
  
    },
    'newSubmission': submit_result,
    'code' : textarea_value,
    'input': input_value,
    'output': output_value,
    'modified':today,
    
    
}

      headers = {
      'Content-Type': 'application/json'
                }

      response = requests.put(api_url, data=json.dumps(payload), headers=headers)

      if response.ok:
         response_data = response.json()
         print(response_data)
      else:
         print(f"Request failed with status code {response.status_code}")
         
           
def getName(req_url):
    url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getSubmission"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json();
        print("kakukll")
        for item in data:
          print(item)
          if item['url'] == req_url:
             req_name=item['name']
             print(req_name)
             return req_name


if __name__ == '__main__':
    app.run(debug=True)
