var hashMap = { "Python": "Python (3.8.1)", "Java": "Java (OpenJDK 13.0.1)", "C": "C (GCC 9.2.0)" };
  var globalId = null;
  var dropdown = document.getElementById("dropdown");
  var select1 = document.getElementById("dropdown1");
  let submissionarray=[];
  let submittedarray=[];
  let inputarray=[];
  let outputarray=[];
  let textarea = document.getElementById('code_input');
  let input_area=document.getElementById('floatingTextarea2');
  let result=document.getElementById('result')

  // Check if the user is logged in (using the variable passed from Flask)
  
// dynamicdropdown1();
dynamic1();

async function getValueFromServer(selectedValue) {
let xmlHttpReq = new XMLHttpRequest();
xmlHttpReq.open("GET", 'https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/language', false);
//xmlHttpReq.open("GET", 'https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getSubmissions', false);

xmlHttpReq.send(null);

let obj = JSON.parse(xmlHttpReq.responseText);
const value1 = obj[0][selectedValue];
console.log("hello new feature------------")
console.log(value1);
console.log("hello new feature------------")
const inputArea = document.getElementById("floatingTextarea2");
const outputArea = document.getElementById("result");
const myTextarea = document.getElementById("code_input");
inputArea.innerHTML = ' ';
outputArea.innerHTML = ' ';
myTextarea.value = value1;
//myTextarea.innerHTML = value1;
}
  dropdown.addEventListener("change", function() {
    const selectedValue = dropdown.value;
  const options = dropdown.options;
  let selectedOptionText = '';

  for (let i = 0; i < options.length; i++) {
    if (options[i].value === selectedValue) {
      selectedOptionText = options[i].textContent;
      break;
    }
  }
  const Selected_value= `${selectedValue}`
  const Selected_option= `${selectedOptionText}`  
  console.log(`Selected value: ${selectedValue}`);
  console.log(`Selected option: ${selectedOptionText}`);
    
  fetch('/select_lang', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    Selected_value: Selected_value,
    Selected_option: Selected_option
  })
})
.then(response => response.json())
.then(data => {
  
  // handle the response data here
  data.forEach(item => {
     // console.log(item.name.toString());
     if(item.name.toString() == hashMap[Selected_option].toString())
      {
      globalId=item.id;
      getValueFromServer(item.id.toString());
     
   } 
    
  })
  console.log(data);
  console.log(selectedValue);
});
  });

 
//run the textarea code
var submitBtn = document.getElementById('Runbtn');
    submitBtn.addEventListener('click', function() {
        var textareaValue = document.querySelector('textarea[name="code_input"]').value;
        var stdin = document.querySelector('textarea[name="input_area"]').value;
        
       
      fetch('/run', {
            method: 'POST',
            body: JSON.stringify({
               textareaValue: textareaValue,
               Selected_value: globalId,
               stdin: stdin
              }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.text())
  .then(data => {
    console.log(data);
    const myTextarea = document.getElementById("result")
    myTextarea.innerHTML = data;
    console.log(data); // prints the returned JSON object
  })
  .catch(error => {
    console.error(error);
  });
    });


//submit the code
var submitBtn = document.getElementById('Executebtn');
    submitBtn.addEventListener('click', function() {
        var textareaValue = document.querySelector('textarea[name="code_input"]').value;
        var stdin = document.querySelector('textarea[name="input_area"]').value;
        var inputValue = document.querySelector('textarea[name="input_area"]').value;
        var outputValue = document.querySelector('textarea[name="code_output"]').value;
        const urlParams = new URLSearchParams(window.location.search);
        const name = urlParams.get('name');
  
        const data1 = { name: name };
        console.log(data1);
        console.log(textareaValue);
       
      fetch('/submit', {
            method: 'POST',
            body: JSON.stringify({
               textareaValue: textareaValue,
               Selected_value: globalId,
               inputValue: inputValue,
               outputValue: outputValue,
               stdin: stdin,
               name:name
              
              }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.text())
  .then(data => {
    console.log(data);
    const myTextarea = document.getElementById("result")
    myTextarea.innerHTML = data;
    // dynamicdropdown1()
    console.log(data); // prints the returned JSON object
  })
  .catch(error => {
    console.error(error);
  });
    });

    function dynamicdropdown() {
      
      const urlParams = new URLSearchParams(window.location.search);
      const name = urlParams.get('name');

      const data1 = { name: name };
      console.log(data1);
 
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
         subarray=[];
         for(let i=0;i<k.length;i++)
         {
           subarray.push(k[i]);
         }
         select1.innerHTML="";
         let newOption = document.createElement("option");
         newOption.value = "Result";
         newOption.textContent = "Result";
         select1.appendChild(newOption);
         for(let i=0;i<subarray.length;i++)
         {
           var option = document.createElement("option");
         option.text =  "submission"+i+"  "+subarray[i];
         option.value = "submission"+i+"  "+subarray[i];
         select1.add(option);
         }
         
       }
     
      
     }
     
    
   });

   
  
 })
 .catch(error => {
   console.error(error);
 });

}


function dynamic1(){
  const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
  console.log(name)
    const data1 = { name: name };
  fetch('https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getSubmissions')
.then(response => response.json())
.then(data => {
  let demosub=[]
  for(let i=0;i<data.length;i++)
  {
    
    let demourl = data[i]['url'];
    let k = demourl.split("/");
   console.log(k)
    let last=k[k.length-1]
    let K1=last.split("=");
    console.log(K1)
    if(K1[K1.length-1]===name)
    {
      let demosub = data[i]['Rounds'][0];
      var dropdown = document.getElementById("dropdown1");

Object.entries(demosub).forEach(([roundKey, submissions]) => {
  // Create the <optgroup> element for the round key
  let optgroup = document.createElement("optgroup");
  optgroup.label = `Round ${roundKey}`;
  
  // Iterate over the submissions and create the corresponding <option> elements
  submissions.forEach((submission, index) => {
    let submissionOption = document.createElement("option");
    submissionOption.value = `${roundKey}.${index + 1}`;
    submissionOption.text = `Submission ${index + 1}`;
    
    // Append the submission option to the <optgroup>
    optgroup.appendChild(submissionOption);
  });
  
  // Append the optgroup to the dropdown
  dropdown.appendChild(optgroup);
});


// Add event listener to handle dropdown selection
dropdown.addEventListener("change", function() {
  let selectedValue = dropdown.value;
  if (selectedValue !== "default") {
    let [roundKey, submissionIndex] = selectedValue.split(".");
    let selectedSubmission = demosub[roundKey][submissionIndex - 1];
    textarea.value=selectedSubmission.SubmittedCode;
    input_area.value=selectedSubmission.Input_Parameter;
    result.value=selectedSubmission.Output;
    console.log("Selected Submission:");
    console.log("SubmittedCode:", selectedSubmission.SubmittedCode);
    console.log("Input_Parameter:", selectedSubmission.Input_Parameter);
    console.log("Output:", selectedSubmission.Output);
    console.log("--------------------");
  }
  else {
    textarea.value = "";
    input_area.value = "";
    result.value = "";
  }
});
}
}
   
})
.catch(error => {
console.error(error);
});

}






// attach an event listener to the parent element
select1.addEventListener("change", (event) => {
   const selectedOption = event.target.value;
  console.log(selectedOption+"-----------------hello");
  
  for(let i = 0;i<submissionarray.length;i++)
  {
    if(selectedOption.includes('submission'+i))
    {
      
      const myTextarea = document.getElementById("code_input")
      myTextarea.innerHTML = "";
      console.log("this is called");
      myTextarea.value = submittedarray[i];
     // myTextarea.innerHTML = submittedarray[i];
      const inputTextarea = document.getElementById("floatingTextarea2")
     // inputTextarea.innerHTML = inputarray[i];
      inputTextarea.value = inputarray[i];
      const outputTextarea = document.getElementById("result")
    //  outputTextarea.innerHTML = outputarray[i];
      outputTextarea.value = outputarray[i];
      console.log(submittedarray[i]);
      console.log("hello rahul this is submkission");
    }
  }
  // perform the desired action based on the selected option

});






