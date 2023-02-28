/*const textarea = document.getElementById("floatingTextarea1");

textarea.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    // Call your function here
    myFunction();
    event.preventDefault();
  }
});

function myFunction() {
  // This is where you would put the code you want to run when the user presses Enter
  console.log("User pressed Enter!");
}*/
var globalId = null;
var div = document.getElementById("layout");
let select = document.getElementById("dropdown");
let select1 = document.getElementById("dropdown1");
let result = document.getElementById("code_input");
$(document).ready(function(){
    $(".pills").hide();
  });
const button = document.getElementById("Executebtn");
button.addEventListener('click', function() {
    submitCode()
    }
  );



  dynamicdropdown();
  

  //making dropdown dynamic using array--------
  /*var options = ["Python", "Java", "C"];

  for (var i = 0; i < options.length; i++) {
    var option = document.createElement("option");
    option.text = options[i];
    select.add(option);
  }*/

  // Create a new Map object
/*var hashMap = new Map();

// Add key-value pairs to the hash map
hashMap.set("Python", "Python (3.8.1)");
hashMap.set("Java", "Java (OpenJDK 13.0.1)");
hashMap.set("C", "C (GCC 9.2.0)");

for (var key in hashMap) {
  console.log(key);
  
 /* if (hashMap.hasOwnProperty(key)) {
    var option = document.createElement("option");
    option.text = key;
    option.value = hashMap[key];
    select.add(option);
  }*/

var hashMap = { "Python": "Python (3.8.1)", "Java": "Java (OpenJDK 13.0.1)", "C": "C (GCC 9.2.0)" };

for (var key in hashMap) {
  if (hashMap.hasOwnProperty(key)) {
    var option = document.createElement("option");
    option.text = key;
    option.value = hashMap[key];
    select.add(option);
    console.log(key);
  }
}



function submitCode()
  {
    console.log(document.getElementById("code_input").value);
    console.log(document.querySelector(".language").value);


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
      console.log("hello");
      let token = JSON.parse(xhr.responseText).token;
      var out=httpGet(token);
      console.log(out);
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
  console.log(obj.status_id==1 );
  console.log(obj.language_id);
  console.log(obj);

  while (obj.status_id ==1 || obj.status_id ==2) {
  xmlHttpReq.open("GET", 'http://34.131.180.20/submissions/'+token+'?base64_encoded=false&fields=stdout,stderr,status_id,language_id,source_code', false);
  xmlHttpReq.send(null);
  obj = JSON.parse(xmlHttpReq.responseText);
 // console.log(xmlHttpReq.responseText)
  }
  if(obj.stderr==null)
  {
    //setData(obj.langauge_id,obj.stdout);
    //console.log(obj.langauge_id);
   // console.log(obj.stdout);
    return obj.stdout;
  }
  else
  {
    console.log(obj.stderr);
   // setData(langauge_id,obj.stdout);
    return obj.stderr;
  }

  
}

//local storage concept

//localStorage.setItem("71","print('hello world');");
//const myString = `This is the first line.\nThis is the second line.`;
//const string=`int main()\n{\nprintf("Hello World");\nreturn 0;\n}\n`;
//localStorage.setItem("50",JSON.stringify(string));


select.onchange = function () {

  fetch('http://34.131.180.20/languages/all')
  .then(response=>response.json())
  .then(data=>{
    //handle the response data here
   
  
   
    const selectedIndex = select.selectedIndex;
      const selectedOption = select.options[selectedIndex];
      const selectedText = selectedOption.text;
      console.log(selectedText);
       
    data.forEach(item => {
      console.log(hashMap[selectedText]);
     // console.log(item.name);
      if(item.name.toString() == hashMap[selectedText].toString())
      {
      console.log(hashMap[selectedText]);
      console.log(item.id);
      globalId=item.id;
      getValueFromServer(item.id.toString());
     // let selectedValue = select.value;
   }
    });
  })
  .catch(error=>{
    //handle any error that occur during the api request.
    console.error(error);
  })


   /* let selectedValue = select.value;
    if(selectedValue==="71")
    {
      
      
     
        //result.innerHTML=value1;
        getValueFromServer(selectedValue);

    }
    else if(selectedValue==="62")
    {
        getValueFromServer(selectedValue);
    }
    else if(selectedValue==="50")
    {
        getValueFromServer(selectedValue);
    }
    */
   
  }

 
 

const url = `https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/language`



async function getValueFromServer(selectedValue) {
    const response = await fetch(url);
    const data = await response.json();
    //const data1=data[0]["data"];
    //console.log(data1[1]["id"]);
    //Object.keys(data1).forEach(function(key) {
     // if(data1[key]["id"]===selectedValue)
     // {
      //  result.innerHTML = data1[key]["Input"];
     // }
   //  console.log(key + " : " + data1[key]["id"]);
   // });
    
    console.log(data[0][selectedValue]);
    const value1 = data[0][selectedValue]; // replace 'key' with the actual key you want to get the value for
    result.innerHTML = value1;
  }
  


  select1.onchange = function () {
   
    fetch(url)
    .then(response=>response.json())
    .then(data=>{
      //handle the response data here
     
     
      const selectedIndex = select1.selectedIndex;
        const selectedOption = select1.options[selectedIndex];
        const selectedText = selectedOption.text;
        console.log(selectedText);
         
      data.forEach(item => {
       if(selectedText==="submission1")
       {
        
        result.innerHTML = item.submission1;
        
       }
       else if(selectedText==="submission2")
       {
      
        result.innerHTML = item.submission2;
      }
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
        if(key==="submission1")
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
        }
       
      }
     
    });

    /*if(data[0][key].toString()==="submission1")
    {
   var option = document.createElement("option");
    option.text = key;
    option.value = data[0][key];
    select1.add(option);
    }*/
   
  })
  .catch(error => {
    console.error(error);
  });

}




  /*getValueFromServer()
  .then(value1 => {
    select.onchange = function () {
        let selectedValue = select.value;
        if(selectedValue==="71")
        {
            result.innerHTML=value1;
        }
       
      }
    console.log(value1); // do something with the value
  });*/


  


//select.onchange = function () {
   // let selectedValue = select.value;
  
   /* if (selectedValue === "71") {
        result.innerHTML = localStorage.getItem("71");
    } 
    else if(selectedValue === "50")
    {
        result.innerHTML = JSON.parse(localStorage.getItem("50"));
    }*/
   // if(selectedValue==="71")
   // {
      //  result.innerHTML=value1;
   // }
   
  //}