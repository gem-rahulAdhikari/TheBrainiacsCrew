from flask import Flask, redirect, url_for, render_template, session,request,jsonify,json,Response,g
import requests
import json
import logging
from flask_cors import CORS
from flask_restful import Resource, Api, reqparse, abort
from datetime import datetime, timedelta,date
from flask_session import Session
import json
import os
from logging.handlers import RotatingFileHandler
import datetime 
import time
import firebase_admin
from firebase_admin import credentials, db
import pandas as pd
import uuid
import base64



cred = credentials.Certificate('serviceAccountKey.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://flask-app-b27bb-default-rtdb.firebaseio.com'
})

log_file = datetime.datetime.now().strftime('app_%Y-%m-%d.log')

app = Flask(__name__, static_folder='static')

active_keys = set()
access_duration = timedelta(seconds=30)

CORS(app)
api = Api(app)

ip_address='34.126.209.148'
# ip_address='34.136.47.80'

hashMap = { "Python": "Python (3.8.1)", "Java": "Java (OpenJDK 13.0.1)", "C": "C (GCC 9.2.0)"}


logging.basicConfig(filename=log_file,level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

#login logic for admin---------------------
json_file_path = os.path.join(os.getcwd(), 'data', 'data.json')
app.secret_key=os.urandom(24)

app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=5)
Session(app)




# Replace these variables with your GitHub repository details
github_username = 'gem-rahulAdhikari'
github_repository = 'selenium_Integartion'
github_personal_access_token = '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'

# Set the API URLs
old_file_path = 'src/test/java/'  # Replace with the current file path
old_file_path1 = 'src/test/java/App.java'  
new_file_path =''
# api_url = f'https://api.github.com/repos/{github_username}/{github_repository}/contents/{old_file_path}'
old_api_url = f'https://api.github.com/repos/{github_username}/{github_repository}/contents/'

api_url1 =f'https://api.github.com/repos/{github_username}/{github_repository}/contents/src/test/java'
complete_path=''


@app.route('/')
def login1():
       if g.user:
        return render_template('Home.html')
       else:
        return render_template('login.html')      
    



@app.route('/profile')
def profile():
    userData = {};
    resume='';
    full_url = request.url
    new_url = full_url.replace("profile", "editor")
    print(new_url)
    url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getAdminTableData"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json();
        for item in data:
            print(item)
            print(new_url)
            if new_url == item['url']:
                userData=item;
                resume=item['Resume']
                break;
    return render_template('profile.html',current_page='profile',userData=userData,resume=resume)

@app.route('/editor')
def editor():
     full_url = request.url
     print("hello")
     
    #  url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getAdminTableData"
     url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getAdminTableDataWithoutFile"
     response = requests.get(url)
     if response.status_code == 200:
        data = response.json();
        for item in data:
            print(item['url'])
            print(full_url)
            if full_url == item['url']:
                keyStatus=item['keyStatus']
                print(keyStatus+"this is key STATUS")
                break;
    
     if keyStatus == 'F':
         return redirect(url_for('error'))
     
     return render_template('index.html',current_page='editor')

@app.route('/question')
def question():
    return render_template('question.html',current_page='question')

@app.route('/vetting_page')
def vetting_page():
    data_array = []
    pdf_data_list = []
    keys_to_display = ['_id', 'Status', 'Name','Resume','Recruiter','Experience', 'Current_Company','keyStatus'] 
    url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getAdminTableData"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        headers = []
        headers = [k.upper() for k in keys_to_display] + ['Url and SecretKey']
        for item in data:
            filtered_item = {k: v for k, v in item.items() if k in keys_to_display}
            filtered_item['CombinedKey'] = f"{item.get('url', '')} {item.get('SecretKey', '')}"
            data_array.append(filtered_item)
    return render_template('vetting_page.html', data=data_array,pdf_data_list=pdf_data_list, headers=headers)
    # return render_template('vetting_page.html')

@app.route('/setting')
def setting():
     
     keys_to_display = ['_id','userId','password','Role']
     data_array = []
     url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/admin"
     response = requests.get(url)
     if response.status_code == 200:
       data12 = response.json()
    #    print(data12)
       headers = []
       headers = [k.upper() for k in keys_to_display]
       for item in data12:
        filtered_item = {k: v for k, v in item.items() if k in keys_to_display}
        data_array.append(filtered_item)
        # print(data_array)
       print(data_array) 
       return render_template('setting.html', data=data_array, headers=headers)
    
@app.route('/about')
def about():
    return render_template('about.html')


result_dict1 = {}
@app.route('/question', methods=['POST'])
def ques():
    
    data = request.json  
    url = data['url']
    selected_options = data.get('selectedObjectId', [])
    print(selected_options);
    api_url4 = 'https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/userQuestion'
                     
    payload = {
                'filter': {
                 'url': url
  
            },
             "newQuestion":selected_options,
                                       
             }
    print(payload)
    headers = {
                     'Content-Type': 'application/json'
                                        }
    response = requests.put(api_url4, data=json.dumps(payload), headers=headers)

    if response.ok:
            response_data = response.json()
            print(response_data)
    else:
            print(f"Request failed with status code {response.status_code}")    
    return jsonify(response_data)


# login-------------------
@app.before_request
def before_request():
    print("start")
    g.user = None

    if 'user' in session:
           
          g.user = session['user']
          print(g.user+"this is user")


@app.route('/selenium')
def selenium():
        current_url = request.args.get('url')
        print("Received URL:", current_url)
        print("this selenium")
        return render_template('selenium.html') 

@app.route('/updateGithub', methods=['POST'])
def updateGithub():
    data = request.json  # Get the JSON data from the request body
    textareaValue1 = data.get('content', '')
    print(textareaValue1)
    textareaValue=''
    current_url = data.get('url', '')
    print(current_url)
    split_url = current_url.split("=")  # Split the URL by '='
    c=0
    req_file_name=''
    req_count=''
    
    if len(split_url) >= 2:
     second_value = split_url[1]  # Get the second value
     print("Second value:", second_value)
    else:
     print("URL format is not as expected")

    

     #get the name of old file
    headers = {
    'Authorization': f'Bearer {github_personal_access_token}',
    'Accept': 'application/vnd.github.v3+json'
     }






#get the name old saved file
    response_old=requests.get(api_url1, headers=headers)
    response_old_json=response_old.json()
    if response_old_json:
        first_entry = response_old_json[-1]  # Get the first entry in the list
        name = first_entry.get("name")
        new_name=name.split("_")
        req_file_name=new_name[0]
        print(req_file_name);
        req_count=new_name[1];
        print(req_count)
        complete_path=old_file_path + name;
        print(complete_path)
    else:
     print("Request failed with status code:", response.status_code) 
      
    if req_file_name == 'selenium-'+second_value:
        c=int(req_count)
        c+=1
        new_file = 'selenium1' + second_value+'_'+ str(c) + '_.java'
        new_file_path = 'src/test/java/' + new_file
        textareaValue = textareaValue1.replace("App", "selenium1"+second_value+"_"+str(c))   
    else:
        new_file = 'selenium1' + second_value+'_'+ str(c) + '_.java'
        new_file_path = 'src/test/java/' + new_file 
        textareaValue = textareaValue1.replace("App", "selenium1"+second_value+"_"+str(c))   




#get the selenium saved data in selenium table

    get_url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getSeleniumOutput"  # Replace with your API URL

    get_response = requests.get(get_url)

    if get_response.status_code == 200:
     data = get_response.json();
     print("Response Data:")
     print(data)
     if data:
      for item in data:
         print(item['url'])
         print("hello this ")
         entry_url = item['url']
         if entry_url == current_url:
            put_url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/updateSeleniumSubmission"  # Replace with your API URL
            data_to_send = {
                "filter": {
                       "url": current_url
                               },
                "SubmittedCode": textareaValue,
                "Output": " "
                   }  # Replace with the data you want to send in the PUT request

            put_response = requests.put(put_url, json=data_to_send)

            if put_response.status_code == 200:
             print("PUT request successful")
            else:
             print(f"PUT request failed with status code: {put_response.status_code}")


         else:
             print("this is post")
             Name=''
             Email=''
             Key=''
             getuser_url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getAdminTableDataWithoutFile"
             getuser_response = requests.get(getuser_url)
             if getuser_response.status_code == 200:
              data = getuser_response.json();
              for item in data:
                  if item['url'] == current_url:
                   Name=item['Name']
                   Email=item['Email']
                   Key=item['SecretKey']
                  
               
             post_url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/addSeleniumResult"  # Replace with your API URL

             data_to_send = {
            "Submissions": [
                             {
                              "SubmittedCode": textareaValue,
                              "Output": ""
                              }
                           ],
                              "name":Name,
                              "Email":Email ,
                              "url": current_url,
                              "key":Key
                       }

             post_response = requests.post(post_url, json=data_to_send)

             if post_response.status_code == 200:
              print("POST request successful")
             else:
              print(f"POST request failed with status code: {post_response.status_code}")


     else:
         print("this is post")
         Name=''
         Email=''
         Key=''
         getuser_url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getAdminTableDataWithoutFile"
         getuser_response = requests.get(getuser_url)
         if getuser_response.status_code == 200:
            data = getuser_response.json();
            for item in data:
                  if item['url'] == current_url:
                   Name=item['Name']
                   Email=item['Email']
                   Key=item['SecretKey']
                  
               
            post_url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/addSeleniumResult"  # Replace with your API URL

            data_to_send = {
            "Submissions": [
                             {
                              "SubmittedCode": textareaValue,
                              "Output": ""
                              }
                           ],
                              "name":Name,
                              "Email":Email ,
                              "url": current_url,
                              "key":Key
                       }

            post_response = requests.post(post_url, json=data_to_send)

            if post_response.status_code == 200:
              print("POST request successful")
            else:
              print(f"POST request failed with status code: {post_response.status_code}")
         


    else:
     print(f"Request failed with status code: {get_response.status_code}")



      
    # Get the current contents and SHA of the file
    old_api_url1=old_api_url+complete_path
    print(old_api_url1)
    response = requests.get(old_api_url1, headers=headers)
    response_json = response.json()
    sha = response_json['sha']
    current_content = base64.b64decode(response_json['content']).decode()
    # Delete the existing file
    delete_payload = {
      'message': 'Deleting existing file',
      'sha': sha
     }
    delete_response = requests.delete(old_api_url1, json=delete_payload, headers=headers)
    print(delete_response.status_code)
    if delete_response.status_code == 200:
     print('Existing file deleted successfully.')

    # Create the new file with the desired name and content
    new_content = textareaValue  # You can modify this if needed
    new_encoded_content = base64.b64encode(new_content.encode()).decode()
    create_payload = {
      'message': 'Creating new file with the desired name',
      'content': new_encoded_content,
      'path': new_file_path
      }
    create_url = f'https://api.github.com/repos/{github_username}/{github_repository}/contents/{new_file_path}'
    create_response = requests.put(create_url, json=create_payload, headers=headers)
    print(create_response.status_code)

    if create_response.status_code == 201:
       response_data = {"message": "New file created successfully."}
       return jsonify(response_data)  # Return a JSON response
    else:
      print('Failed to create new file.')
      print(create_response.json())

    

@app.route('/updatewithoutchangename', methods=['POST']) 
def updateFile():
    try:
        booleanValue=False
        second_value=''
        data = request.json  # Get the JSON data from the request body
        textareaValue1 = data.get('content', '')
        new_report_name = "New Report Name"
        start_index = textareaValue1.find('static String reportName')
        quote_start = textareaValue1.find('"', start_index)
        quote_end = textareaValue1.find('"', quote_start + 1)
        
        count=data.get('count', '')
        current_url = data.get('url', '')
        split_url = current_url.split("=")
        if len(split_url) >= 2:
         second_value = split_url[1]  # Get the second value
         print("Second value:", second_value)
        else:
         print("URL format is not as expected")


        textareaValue = (
                              textareaValue1[:quote_start + 1]
                             + "Report_"+second_value+"_"+str(count)
                              + textareaValue1[quote_end:]
                             )

        print(textareaValue) 

        headers = {
            'Authorization': f'Bearer {github_personal_access_token}',
            'Accept': 'application/vnd.github.v3+json'
        }

        #get the selenium saved data in selenium table

        get_url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getSeleniumOutput"  # Replace with your API URL

        get_response = requests.get(get_url)

        if get_response.status_code == 200:
         data = get_response.json();
         print("Response Data:")
         print(data)
         if data:
          for item in data:
           print(item['url'])
           print("hello this ")
           entry_url = item['url']
           if entry_url == current_url:
              booleanValue=True
              break;
            #  put_url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/updateSeleniumSubmission"  # Replace with your API URL
            #  data_to_send = {
            #     "filter": {
            #            "url": current_url
            #                    },
            #     "SubmittedCode": textareaValue,
            #     "Output": " "
            #        } 

            #  put_response = requests.put(put_url, json=data_to_send)

            #  if put_response.status_code == 200:
            #   print("PUT request successful")
            #  else:
            #   print(f"PUT request failed with status code: {put_response.status_code}")


        #    else:
        #       print("this is post")
        #       Name=''
        #       Email=''
        #       Key=''
        #       getuser_url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getAdminTableDataWithoutFile"
        #       getuser_response = requests.get(getuser_url)
        #       if getuser_response.status_code == 200:
        #        data = getuser_response.json();
        #        for item in data:
        #           if item['url'] == current_url:
        #            Name=item['Name']
        #            Email=item['Email']
        #            Key=item['SecretKey']
                  
               
        #       post_url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/addSeleniumResult"  # Replace with your API URL

        #       data_to_send = {
        #       "Submissions": [
        #                     #  {
        #                     #   "SubmittedCode": textareaValue,
        #                     #   "Output": ""
        #                     #   }
        #                    ],
        #                       "name":Name,
        #                       "Email":Email ,
        #                       "url": current_url,
        #                       "key":Key
        #                }

        #       post_response = requests.post(post_url, json=data_to_send)

        #       if post_response.status_code == 200:
        #        print("POST request successful")
        #       else:
        #        print(f"POST request failed with status code: {post_response.status_code}")


         else:
          print("this is post")
          booleanValue=True
          Name=''
          Email=''
          Key=''
          getuser_url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getAdminTableDataWithoutFile"
          getuser_response = requests.get(getuser_url)
          if getuser_response.status_code == 200:
            data = getuser_response.json();
            for item in data:
                  if item['url'] == current_url:
                   Name=item['Name']
                   Email=item['Email']
                   Key=item['SecretKey']
                  
               
            post_url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/addSeleniumResult"  # Replace with your API URL

            data_to_send = {
            "Submissions": [
                            #  {
                            #   "SubmittedCode": textareaValue,
                            #   "Output": ""
                            #   }
                           ],
                              "name":Name,
                              "Email":Email ,
                              "url": current_url,
                              "key":Key
                       }

            post_response = requests.post(post_url, json=data_to_send)

            if post_response.status_code == 200:
              print("POST request successful")
            else:
              print(f"POST request failed with status code: {post_response.status_code}")

        else:
         print(f"Request failed with status code: {get_response.status_code}")      
         


        
        if booleanValue==False:
            print("this is post")
            Name=''
            Email=''
            Key=''
            getuser_url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getAdminTableDataWithoutFile"
            getuser_response = requests.get(getuser_url)
            if getuser_response.status_code == 200:
             data = getuser_response.json();
             for item in data:
                  if item['url'] == current_url:
                   Name=item['Name']
                   Email=item['Email']
                   Key=item['SecretKey']
                  
               
             post_url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/addSeleniumResult"  # Replace with your API URL

             data_to_send = {
             "Submissions": [
                            #  {
                            #   "SubmittedCode": textareaValue,
                            #   "Output": ""
                            #   }
                           ],
                              "name":Name,
                              "Email":Email ,
                              "url": current_url,
                              "key":Key
                       }

             post_response = requests.post(post_url, json=data_to_send)

             if post_response.status_code == 200:
              print("POST request successful")
             else:
              print(f"POST request failed with status code: {post_response.status_code}")

        
        url = f'https://api.github.com/repos/{github_username}/{github_repository}/contents/{old_file_path1}'
        response = requests.get(url, headers=headers)
        response_json = response.json()
        print(response_json)
        sha = response_json['sha']

        current_content = response_json['content']
        current_content_decoded = base64.b64decode(current_content).decode()

        # Modify the content
        updated_content = textareaValue

        encoded_content = base64.b64encode(updated_content.encode()).decode()

        # Prepare the request payload
        data = {
            'message': 'Text update from online input',
            'content': encoded_content,
            'sha': sha,
            'path': old_file_path1  # Keep the same path
        }

        # Send the request to update the file on GitHub
        update_url = f'https://api.github.com/repos/{github_username}/{github_repository}/contents/{old_file_path1}'
        response = requests.put(update_url, json=data, headers=headers)

        if response.status_code == 200:
            print('File updated successfully.')
        else:
            print('Failed to update file.')
            print(response.json())

        return jsonify({'message': 'Text pushed to GitHub successfully!'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to push text to GitHub.'}), 500    
        


@app.route('/login', methods=['GET', 'POST'])
def login():
   
    # session.permanent = True
    if request.method == 'POST':
       
        # Clear previous session data
        session.pop('user', None)
        session.pop('password', None)
        session.pop('role', None)
       
        
        username = request.form.get('username')
        password = request.form.get('password')
        
        
        # Make the API request to fetch user data
        url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/admin"
        response = requests.get(url)
        print(response)
        
        if response.status_code == 200:
            data = response.json()
            
            for item in data:
                if username == item['userId']:
                    print("this is req role");
                    fetched_username = item['userId']
                    fetched_password = item['password']
                    print(fetched_username)
                    print(fetched_password)
                    print(username)
                    print(password)
                    role = item['Role']
                    print(role+"this is req role");
                    break
            
            if username == fetched_username and password == fetched_password:
              session['user'] = username
              session['password'] = password
              session['role'] = role
              print(role);
                
            if role == 'Admin' or role == 'HR' or role == 'Interviewer':

              return render_template('Home.html', role=role)
            
            # return redirect(url_for('protected', role=role))
        
        #return render_template('error.html')
    
    # Display login form
    return render_template('login.html')

@app.route("/logout", methods=["POST"])
def dropsession():
    session.pop('user', None)
    session.pop('password', None)
    return render_template('login.html')


# @app.route('/admin')
# def protected():
#     role = session.get('role')
#     pdf_data=''
#     pdf_data_list = []
#     data_array = []
#     keys_to_display = ['_id', 'Status', 'Name','Resume','Recruiter','Experience', 'Current_Company','keyStatus'] 
#     url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getAdminTableData"
#     response = requests.get(url)
#     if response.status_code == 200:
#         data = response.json()
#         headers = []
#         headers = [k.upper() for k in keys_to_display] + ['Url and SecretKey']
#         for item in data:
#           file_string = item.get('Resume')
#           if file_string:
#               file_data = file_string.get('data', '')
#               pdf_data_list.append(file_data)
              
#           filtered_item = {k: v for k, v in item.items() if k in keys_to_display}
#           filtered_item['CombinedKey'] = f"{item.get('url', '')} {item.get('SecretKey', '')}"
#           data_array.append(filtered_item)
#           # Add CombinedKey to the headers list
#         print(pdf_data_list)  
#     return render_template('adminTable.html', data=data_array,pdf_data_list=pdf_data_list, headers=headers,role=role)

@app.route('/admin',methods=['GET','POST'])
def protected():
    if request.method == 'GET':
     role = session.get('role')
     print(role)
     print("above is given role")
     current_month = datetime.datetime.now().month
     data_array = []
     pdf_data_list = []
     keys_to_display = ['_id', 'Status', 'Name','Recruiter','Experience', 'Current_Company','keyStatus','EndMonth'] 
    #  url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getAdminTableData"
     url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getAdminTableDataWithoutFile"
     response = requests.get(url)
     if response.status_code == 200:
         data = response.json()
         headers = []
         headers = [k.upper() for k in keys_to_display] + ['Url and SecretKey']
         for item in data:
              if item.get('StartMonth') == current_month and item.get('EndMonth') == "":
                filtered_item = {k: v for k, v in item.items() if k in keys_to_display}
                filtered_item['CombinedKey'] = f"{item.get('url', '')} {item.get('SecretKey', '')}"
                data_array.append(filtered_item)
     return render_template('adminTable.html', data=data_array,pdf_data_list=pdf_data_list, headers=headers,role=role)
    elif request.method == 'POST':
     selected_month = request.json.get('month')
     print(selected_month)
     role = session.get('role')
     data_array = []
     pdf_data_list = []
     keys_to_display = ['_id', 'Status', 'Name', 'Recruiter', 'Experience', 'Current_Company', 'keyStatus', 'EndMonth']
     url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getAdminTableDataWithoutFile"
     response = requests.get(url)
     if response.status_code == 200:
         data = response.json()
         headers = [k.upper() for k in keys_to_display] + ['Url and SecretKey']
         for item in data:
             if item.get('EndMonth') == selected_month:
                 filtered_item = {k: v for k, v in item.items() if k in keys_to_display}
                 filtered_item['CombinedKey'] = f"{item.get('url', '')} {item.get('SecretKey', '')}"
                 data_array.append(filtered_item)
                 print(data_array);
    
    #  return render_template('adminTable.html', data=data_array, pdf_data_list=pdf_data_list, headers=headers, role=role)
         return jsonify(data_array)







@app.route('/updateTable', methods=['POST'])
def update_status():
    row_id = request.form.get('rowId')
    new_value = request.form.get('newValue')
    email=''
    reqKey = request.form.get('key')
    print('heloo john')
    print(row_id);
    print(new_value);
  
    print(reqKey);

    url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getAdminTableData"
    # with open(json_file_path) as f:
    #     data = json.load(f)
    #     url =  data.get("adminTableData", "")
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json();
    for item in data:
        id_value = item['_id']
        if(row_id==id_value):
            email = item['Email'];
            emailKey=email;
            print(emailKey)
            break;
    print(email+"hello email")
    # with open(json_file_path) as f:
    #     data = json.load(f)
    #     api_url =  data.get("updateAdminTableData", "")
    api_url = 'https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/updateAdminTable'

    payload = {
    'filter': {
       'Email': email
  
    },
    "key": reqKey,
    "value": new_value
    
    
}
    print(payload)

    headers = {
      'Content-Type': 'application/json'
                }

    response = requests.put(api_url, json=payload, headers=headers)

    if response.ok:
         response_data = response.json()
         print(response_data)
    else:
         print(f"Request failed with status code {response.status_code}")

    
    return jsonify({'success': True})



@app.route('/updateAdminTable', methods=['POST'])
def update_status1():
    row_id = request.form.get('rowId')
    new_value = request.form.get('newValue')
    userId=''
    reqKey = request.form.get('key')
    print('heloo john')
    print(row_id);
    print(new_value);
  
    print(reqKey);

    url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/admin"
    # with open(json_file_path) as f:
    #     data = json.load(f)
    #     url =  data.get("adminTableData", "")
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json();
    for item in data:
        id_value = item['_id']
        if(row_id==id_value):
            userId = item['userId'];
            emailKey=userId;
            print(emailKey)
            break;
   
    # with open(json_file_path) as f:
    #     data = json.load(f)
    #     api_url =  data.get("updateAdminTableData", "")
    api_url = 'https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/updateUserRole'

    payload = {
    'filter': {
       'userId': userId
  
    },
    "key": reqKey,
    "value": new_value
    
}
    
    print(payload);

    headers = {
      'Content-Type': 'application/json'
                }

    response = requests.put(api_url, json=payload, headers=headers)

    if response.ok:
         response_data = response.json()
         print(response_data)
    else:
         print(f"Request failed with status code {response.status_code}")

    
    return jsonify({'success': True})


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
    print("lello")
    print(name)
    print(Selected_value)
    print(textarea_value)
    print(today)
    print("lello")
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
    print("heloooooooooo")
    req_url=getUrl(name)
    print("helloooo");
    print(req_url)
    req_name=getName(req_url)
    print("heloo prya")
    print(req_name)
    updateVal(out,req_url,textarea_value,input_value,output_value,date_string)
    
   
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
    #  with open(json_file_path) as f:
    #     data = json.load(f)
    #     url =  data.get("getSubmissions", "")
     url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getSubmissions"
     response = requests.get(url)
     if response.status_code == 200:
        data = response.json();
        for item in data:
          fetchedUrl = item['url']
          print( fetchedUrl)
          result = fetchedUrl.split("/")
          print("this is url function")
          print(result)
          my_string = result[-1]
          result1 = my_string.split("=")
          print(result1[-1])
          if result1[-1] == name:
              my_bool=True;
              print("got it")
            #   return item['url']
              print(fetchedUrl+'heloji')
              return fetchedUrl
         
        print("not find")
        setUrl(name)
        return name      
          
     else:
        raise Exception("Error accessing API: " + response.text)
     


def setUrl(name):
     
     req_url="http://gem-codeeditor.wl.r.appspot.com/?name="+name
     req_name=getName(req_url)
    #  with open(json_file_path) as f:
    #     data = json.load(f)
    #     api_url =  data.get("setSubmissions", "")
     api_url = 'https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/userSubmissions'

     data = {
    # Replace with your body parameter
    "submissions": [],
    "submittedCode": [],
    "inputArray": [],
    "outputArray": [],
    "name":req_name,
     # "url": "http://127.0.0.1:5000/?name="+name
    "url": "http://g-codeeditor.el.r.appspot.com/?name="+name,
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
      print("this is updateVal")
      print(textarea_value)
      print(input_value)
      print(output_value)
      
      
    #   with open(json_file_path) as f:
    #     data = json.load(f)
    #     api_url =  data.get("updateSubmissions", "")


      api_url1 = 'https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getSubmissions'
      response1 = requests.get(api_url1)
      if response1.status_code == 200:
        data = response1.json()  # Assuming the response is in JSON format
        for item in data:
            fetchedUrl = item['url']
            if fetchedUrl == name:
                req_Round=item['Rounds']
                rounds_length = len(req_Round[0])
                print(rounds_length)
                print(req_Round)
                print(req_Round[0].get(str(rounds_length)))
                req_data=req_Round[0].get(str(rounds_length))
                print(type(req_data))
                print(type(req_data[0]));
                
                for key, value in req_data[0].items():
                    if key == 'SubmittedCode':
                        if value:
                            print("SubmittedCode is not empty.")
                            api_url3 = 'https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/updateRounds'
                     
                            payload = {
                                       'filter': {
                                                    'url': name
  
                                       },
                                       "submission_No":"2",
                                       'submittedCode':textarea_value,
                                       'inputParameter': input_value,
                                       'output': output_value,
                                        "roundNumber":rounds_length
                                       }

                            headers = {
                                'Content-Type': 'application/json'
                                        }
                            response = requests.put(api_url3, data=json.dumps(payload), headers=headers)

                            if response.ok:
                             response_data = response.json()
                             print(response_data)
                            else:
                              print(f"Request failed with status code {response.status_code}")
                         
                        else:
                          print("it is empty")
                          api_url2 = 'https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/updateRoundsSubmission'
                          payload = {
                                       'filter': {
                                                    'url': name
  
                                       },
                                      
                                       "submittedCode": textarea_value,
                                       "inputParameter": input_value,
                                       "output": output_value,
                                        "roundNumber":rounds_length
                                       
                                       }

                          headers = {
                                'Content-Type': 'application/json'
                                        }
                          response = requests.put(api_url2, data=json.dumps(payload), headers=headers)

                          if response.ok:
                             response_data = response.json()
                             print(response_data)
                          else:
                              print(f"Request failed with status code {response.status_code}")
                            
                     
                    
                

                
            
      else:
        print("API request failed with status code:", response1.status_code)


           
def getName(req_url):
    # with open(json_file_path) as f:
    #     data = json.load(f)
    #     url =  data.get("getSubmissions", "")
    #     print("hello how are you")
    url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getSubmissions"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json();
        
        for item in data:
          print(item)
          print("this is req url")
          print(item['url'])
          if item['url'] == req_url:
             req_name=item['name']
             print(req_name)
             return req_name
          


@app.route('/error')
def error():
    
    return render_template('error.html')   




if __name__ == '__main__':
    app.run(debug=True)
