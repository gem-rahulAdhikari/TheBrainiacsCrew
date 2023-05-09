from flask import Flask, render_template, request, redirect, url_for,make_response
import requests
from flask_restful import Resource, Api, reqparse, abort



app = Flask(__name__)

@app.route('/')
def demo():
 
    return render_template('urlGenerator.html')


@app.route("/data")
def get_data():
      data_array = []
      keys_to_display = ['_id','Status','Name','Recruiter','Experience','Current_Company']
      url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getAdminTableData"
      response = requests.get(url)
      if response.status_code == 200:
       data = response.json()
       print(data)
       for item in data:
         filtered_item = {k: v for k, v in item.items() if k in keys_to_display}
         data_array.append(filtered_item)
       headers = [k.upper() for k in keys_to_display]  
      return render_template('index.html', data=data_array,headers=headers)



@app.route('/my-flask-route', methods=['POST'])
def my_flask_route():
    data = request.get_json()
    id = data['id']
    print(f"ID: {id}")
    # Do something with the ID value
   
    # name='';
    # email='';
    # # Get the ID, name, and email from the request data
    # id = data['id']
    # print('hello')
    

    # # Do something with the data
    # print(f"ID: {id}")
    url = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getAdminTableData"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json();
    for item in data:
        id_value = item['_id']
        if(id==id_value):
            name = item['Name'];
            email = item['Email'];
            break;
        
    
    print(name);
    print(email);
    
    return render_template('urlGenerator.html',name=name,email=email);
   
    
       
      


if __name__ == '__main__':
    app.run(debug=True)