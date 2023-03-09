
var globalId = null;
var statusIdG= null;
var errorStatus=null;
var submitResult = null;
var div = document.getElementById("layout");
let select = document.getElementById("dropdown");
let select1 = document.getElementById("dropdown1");
let result = document.getElementById("code_input");
$(document).ready(function(){
    $(".pills").hide();
  });
const button = document.getElementById("Executebtn");
const runbtn = document.getElementById("Runbtn");
button.addEventListener('click', function() {
    submitCode()
    }
  );

  runbtn.addEventListener('click', function() {
    RunCode()
    }
  );

  dynamicdropdown();
  

var hashMap = { "Python": "Python (3.8.1)", "Java": "Java (OpenJDK 13.0.1)", "C": "C (GCC 9.2.0)" };

for (var key in hashMap) {
  if (hashMap.hasOwnProperty(key)) {
    var option = document.createElement("option");
    option.text = key;
    option.value = hashMap[key];
    select.add(option);
    
  }
}

select.onchange =  function () {

  fetch('http://34.131.180.20/languages/all')
  .then(response=>response.json())
  .then(data=>{
    //handle the response data here
   
    const selectedIndex = select.selectedIndex;
    const selectedOption = select.options[selectedIndex];
    const selectedText = selectedOption.text;
    
       
    data.forEach(item => {
      //console.log(hashMap[selectedText]);
    
      if(item.name.toString() == hashMap[selectedText].toString())
      {
      globalId=item.id;
      getValueFromServer(item.id.toString());
     
   }
    });
  })
  .catch(error=>{
    //handle any error that occur during the api request.
    console.error(error);
  })

}
async function getValueFromServer(selectedValue) {

let xmlHttpReq = new XMLHttpRequest();
xmlHttpReq.open("GET", 'https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/language', false);
xmlHttpReq.send(null);

let obj = JSON.parse(xmlHttpReq.responseText);
const value1 = obj[0][selectedValue];
console.log(value1);
const myTextarea = document.getElementById("code_input");
myTextarea.value = value1;
//result.innerHTML = value1;
}


function submitCode()
  {
  var data = JSON.stringify({
    "source_code":document.getElementById("code_input").value,
    "language_id": globalId,
    "number_of_runs": null,
    "stdin": null,
    "expected_output": null,
    "cpu_time_limit": null,
    "cpu_extra_time": null,
    "wall_time_limit": null,
    "memory_limit": null,
    "stack_limit": null,
    "max_processes_and_or_threads": null,
    "enable_per_process_and_thread_time_limit": null,
    "enable_per_process_and_thread_memory_limit": null,
    "max_file_size": null,
    "enable_network": null
  });
 
  
  var xhr = new XMLHttpRequest();


  xhr.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
      
      console.log(JSON.parse(xhr.responseText).token);
      console.log("hello karan");
      let token = JSON.parse(xhr.responseText).token;
      var out=httpGet(token);
     
    //  console.log(out);
      
     document.getElementById("result").innerHTML = out;
     submitResult=out;
     updatetheval();

      
    }
  });

  xhr.open("POST", "http://34.131.180.20/submissions");
  xhr.setRequestHeader("X-Auth-Token", "X-Auth-Token");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.send(data);
  //console.log(data);

}

function RunCode()
  {
  

  var data = JSON.stringify({
    "source_code":document.getElementById("code_input").value,
    "language_id": globalId,
    "number_of_runs": null,
    "stdin": null,
    "expected_output": null,
    "cpu_time_limit": null,
    "cpu_extra_time": null,
    "wall_time_limit": null,
    "memory_limit": null,
    "stack_limit": null,
    "max_processes_and_or_threads": null,
    "enable_per_process_and_thread_time_limit": null,
    "enable_per_process_and_thread_memory_limit": null,
    "max_file_size": null,
    "enable_network": null
  });
 
  
  var xhr = new XMLHttpRequest();


  xhr.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
      
      console.log(JSON.parse(xhr.responseText).token);
      console.log("hello karan");
      let token = JSON.parse(xhr.responseText).token;
      var out=httpGet(token);
     
    //  console.log(out);
      
     document.getElementById("result").innerHTML = out;
     

      
    }
  });

  xhr.open("POST", "http://34.131.180.20/submissions");
  xhr.setRequestHeader("X-Auth-Token", "X-Auth-Token");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.send(data);
  //console.log(data);

}
function httpGet(token) {
  let xmlHttpReq = new XMLHttpRequest();
  xmlHttpReq.open("GET", 'http://34.131.180.20/submissions/'+token+'?base64_encoded=false&fields=stdout,stderr,status_id,language_id,source_code', false);
  xmlHttpReq.send(null);

  let obj = JSON.parse(xmlHttpReq.responseText);
  
  //console.log(obj);

  while (obj.status_id ==1 || obj.status_id ==2) {
  xmlHttpReq.open("GET", 'http://34.131.180.20/submissions/'+token+'?base64_encoded=false&fields=stdout,stderr,status_id,language_id,source_code', false);
  xmlHttpReq.send(null);
  obj = JSON.parse(xmlHttpReq.responseText);
 // console.log(xmlHttpReq.responseText)
  }
  statusIdG=obj.status_id;
  console.log(obj.status_id);
  if(obj.status_id===4 || obj.status_id===5 || obj.status_id===6 || obj.status_id===7 || obj.status_id===8 || obj.status_id===9 || obj.status_id===10 || obj.status_id===11 || obj.status_id===13 || obj.status_id===14)
  {
  
    errorStatus=Status(obj.status_id);
    return errorStatus;
  }
  else
  {
 console.log("hello rahul");
  if(obj.stderr==null)
  {
   
    return obj.stdout;
  }
  else
  {
    console.log(obj.stderr);
    return obj.stderr;
  }
}

  
}


function Status(statusId)
{
 
  
 if(statusId.toString()==="4")
 {
  
  var error1="Wrong Answer";
  return error1
 }
 else if(statusId.toString()==="5")
 {
  
  var error1="Time Limit Exceeded";
  return error1
 }
 else if(statusId.toString()==="6")
 {
 
 
 var error1="Compilation Error";
  return error1
 }
 else if(statusId.toString()==="7")
 {
 
 var error1="Runtime Error (SIGSEGV)";
  return error1
 }
 else if(statusId.toString()==="8")
 {
 
 var error1="Runtime Error (SIGXFSZ)";
  return error1
 }
 else if(statusId.toString()==="9")
 {
 
  var error1="Runtime Error (SIGFPE)";
  return error1
 }
 else if(statusId.toString()==="10")
 {

 var error1="Runtime Error (SIGABRT)";
  return error1
 }
 else if(statusId.toString()==="11")
 {
  
  var error1="Runtime Error (NZEC)";
  return error1
 }
 else if(statusId.toString()==="12")
 {
  
  var error1="Runtime Error (Other)";
  return error1
 }
 else if(statusId.toString()==="13")
 {
 
 var error1="Internal Error";
  return error1
 }
 else if(statusId.toString()==="14")
 {
 
  var error1="Exec Format Error";
  return error1
 }
}



 
 select1.onchange = function () {
   
    fetch(url)
    .then(response=>response.json())
    .then(data=>{
      
        const selectedIndex = select1.selectedIndex;
        const selectedOption = select1.options[selectedIndex];
        const selectedText = selectedOption.text;
        
       data.forEach(item => {
      console.log(item);
      });
    })
    .catch(error=>{
      //handle any error that occur during the api request.
      console.error(error);
    })
  
  }

//Make the submission dropdown dynamic


 function dynamicdropdown() {
  fetch('https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/language')
  .then(response => response.json())
  .then(data => {
    data.forEach(item => {
      for (let key of Object.keys(item)) {
        console.log(key);
        if(key==="submissions")
        {
          let str = `${item[key]}`;
          let k = str.split(",");
          console.log(k);
          for (let k1 of k) {
           
            var option = document.createElement("option");
          option.text =  k1
          option.value = k1
          select1.add(option);
          }
         
          //console.log(`${key}: ${item[key]}`);
        }
       /* if(key==="submission1")
        {
          var option = document.createElement("option");
          option.text = key;
          option.value = key;
          select1.add(option);
        }
        else if(key==="submission2")
        {
          var option = document.createElement("option");
          option.text = key;
          option.value = key;
          select1.add(option);
        }*/
       
      }
      
     
    });

    
   
  })
  .catch(error => {
    console.error(error);
  });

}


//update the db

function updatetheval() {

  let xmlHttpReq = new XMLHttpRequest();
  xmlHttpReq.open("PUT", `https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/updateData?value=${submitResult}`, false);
  xmlHttpReq.send(null);
  let obj = JSON.parse(xmlHttpReq.responseText);
  console.log(obj);
  dynamicdropdown()

}




  

 

  


