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
var div = document.getElementById("layout");
let select = document.getElementById("dropdown");
let result = document.getElementById("code_input");
$(document).ready(function(){
    $(".pills").hide();
  });
const button = document.getElementById("Executebtn");
button.addEventListener('click', function() {
    submitCode()
    }
  );
  

function submitCode()
  {
    console.log(document.getElementById("code_input").value);
    console.log(document.querySelector(".language").value);


  var data = JSON.stringify({
    "source_code":document.getElementById("code_input").value,
    "language_id": document.querySelector(".language").value,
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
      
      document.getElementById("result").innerHTML = httpGet(token);
    }
  });

  xhr.open("POST", "http://34.131.180.20/submissions");
  xhr.setRequestHeader("X-Auth-Token", "X-Auth-Token");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.send(data);
  console.log(data);

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
  console.log(xmlHttpReq.responseText)
  }

  return obj.stdout;
}

//local storage concept

//localStorage.setItem("71","print('hello world');");
//const myString = `This is the first line.\nThis is the second line.`;
//const string=`int main()\n{\nprintf("Hello World");\nreturn 0;\n}\n`;
//localStorage.setItem("50",JSON.stringify(string));


select.onchange = function () {
    let selectedValue = select.value;
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
    
   
  }

 

const url = `https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/language`


async function getValueFromServer(selectedValue) {
    const response = await fetch(url);
    const data = await response.json();
    const value1 = data[0][selectedValue]; // replace 'key' with the actual key you want to get the value for
    result.innerHTML = value1;
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