const expandIcon = document.getElementById('expand-icon');
const compressIcon = document.getElementById('compress-icon');
const editor = document.getElementById('code_input');
const editorContainer = document.getElementById('editor-container');
var hashMap = { "Python": "Python (3.8.1)", "Java": "Java (OpenJDK 13.0.1)", "C++": "C++ (Clang 7.0.1)","Selenium":"Selenium" };
  var globalId = null;
  var dropdown = document.getElementById("dropdown");
  var select1 = document.getElementById("dropdown1");
  let submissionarray=[];
  let submittedarray=[];
  let inputarray=[];
  let outputarray=[];
  let textarea = document.getElementById('code_input');
  let input_area=document.getElementById('inputTextarea');
  let result=document.getElementById('outputTextarea')
  let selenium=false;



//expanding side navbar
document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');

    sidebar.addEventListener('click', function () {
        toggleSidebarWidth();
    });

    function toggleSidebarWidth() {
        if (sidebar.style.width === '70px') {
            sidebar.style.width = '40px';
        } else {
            sidebar.style.width = '70px';
        }
    }
});

document.getElementById('toggleIcon').addEventListener('click', toggleContainers);
document.getElementById('Runbtn').addEventListener('click', toggleContainersRun);

function toggleContainersRun() {
  var container = document.getElementById('buttons-container');
  var textareaContainer = document.getElementById('textareas-container');
  var icon = document.getElementById('toggleIcon');
  // Get the computed style for the height
  var containerHeight = window.getComputedStyle(container).height;
  if (containerHeight === '40px') {
    container.style.height = '80px';
      textareaContainer.style.display = 'flex';
      textareaContainer.style.height = '80px';
      icon.classList.remove('fa-caret-down');
      icon.classList.add('fa-caret-up');
  }

}

function toggleContainers() {
  console.log("click on icon");
  var container = document.getElementById('buttons-container');
  var textareaContainer = document.getElementById('textareas-container');
  var icon = document.getElementById('toggleIcon');

  // Get the computed style for the height
  var containerHeight = window.getComputedStyle(container).height;

  if (containerHeight === '80px') {
      container.style.height = '40px';
      textareaContainer.style.display = 'none';
      textareaContainer.style.height = '40px';
      icon.classList.remove('fa-caret-up');
      icon.classList.add('fa-caret-down');
  } else {
      container.style.height = '80px';
      textareaContainer.style.display = 'flex';
      textareaContainer.style.height = '80px';
      icon.classList.remove('fa-caret-down');
      icon.classList.add('fa-caret-up');
  }
}

//drodown langugae selection

dropdown.addEventListener("change", function() {
    const selectedValue = dropdown.value;
  const options = dropdown.options;
  let selectedOptionText = '';
  console.log("hello")

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

  if(Selected_option !== "Selenium")
  {  
    console.log("this is not selenium")
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
  const divElement = document.getElementById("result1");
        if (divElement) {
          const textareaElement = document.createElement("textarea");
          textareaElement.id = "result"; // Restore the original ID if needed
          textareaElement.style.height = "25vh";
          textareaElement.classList.add("form-control");
          textareaElement.style.overflow = "auto";
          textareaElement.value =" "
          divElement.parentNode.replaceChild(textareaElement, divElement);
          textareaElement.setAttribute("name", "code_output");
          selenium = false
        }
});
  }
  else
  {
  selenium=true;
console.log("this is selenium execution")
console.log("hello");
const currentURL = window.location.href;
getValueFromServer("Selenium");
console.log("Current URL:", currentURL);
const textareaElement = document.getElementById("result");
const divElement = document.createElement("div");
divElement.id = "result1"; // Replace with your desired ID
divElement.style.height = "25vh";
divElement.style.overflow = "auto"; // Add scrollbars if content overflows
divElement.innerHTML = textareaElement.value;
textareaElement.parentNode.replaceChild(divElement, textareaElement);

  }
  });

  async function getValueFromServer(selectedValue) {
    console.log("getValuefromserver this is")
    console.log(selectedValue)
    let xmlHttpReq = new XMLHttpRequest();
    xmlHttpReq.open("GET", 'https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/language', false);
    xmlHttpReq.send(null);
    let obj = JSON.parse(xmlHttpReq.responseText);
    const value1 = obj[0][selectedValue];
    console.log("hello new feature------------")
    console.log(value1);
    console.log("hello new feature------------")
    const inputArea = document.getElementById("inputTextarea");
    const outputArea = document.getElementById("outputTextarea");
    const myTextarea = document.getElementById("code_input");
    if (inputArea !== null) {
      inputArea.innerHTML = ' ';
    }
    if(outputArea!==null){
      outputArea.value = ' ';
    }
    else
    {
    
      console.log("this is not define")
    }
    
    myTextarea.value = value1;
    
    
    // myTextarea.innerHTML = value1;
    }

    //run the textarea code
var runBtn = document.getElementById('Runbtn');
runBtn.addEventListener('click', function() {
  console.log("run button")
    var textareaValue = document.querySelector('textarea[name="code_input"]').value;
    console.log("this is the template");
    console.log(textareaValue);
    const formattedValue = textareaValue
.replace(/\n/g, '\\n')
.replace(/"/g, '\\"');

console.log(formattedValue);
    var stdin = document.querySelector('textarea[name="input_area"]').value;
    
   if(selenium === false)
   {
    console.log("this is not selenium")
  fetch('/run', {
        method: 'POST',
        body: JSON.stringify({
           textareaValue: formattedValue,
           Selected_value: globalId,
           stdin: stdin
          }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.text())
.then(data => {
console.log(data);
const myTextarea = document.getElementById("outputTextarea")
if (myTextarea !== null) {
  // There is a textarea element with the ID "result"
  console.log("Textarea with ID 'result' exists.");
  // You can perform further actions here if needed
} else {
  // There is no textarea element with the ID "result"
  console.log("Textarea with ID 'result' does not exist.");
  // You can perform alternative actions here if needed
}
myTextarea.value = data;
console.log(data); // prints the returned JSON object
})
.catch(error => {
console.error(error);
});
}
// else
// {
// console.log("this is selenium")
// fetch('https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getSeleniumOutput')
// .then(response => response.json())
// .then(data => {
// console.log(data);
// // Iterate over the data array
// data.forEach(item => {
//   if(item.url==currentURL)
//   {
//       if (item.hasOwnProperty("Submissions"))
//       {
// console.log(item.Submissions.length);
// c=item.Submissions.length;
// console.log(c)
//       }

//       else
//       {
//           c=0;
//       }
//   }
// });
// console.log("this is "+c)
// makePostRequest(c,currentURL);
// })
// .catch(error => console.error(error));
// async function makePostRequest(c,currentURL) {
// console.log(c)
// try {
// const response = await fetch('/updatewithoutchangename', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ content: textareaValue,url: currentURL,count: c }) 
// });
// const responseData = await response.text();
// console.log(responseData)
// if (response.ok) {
//     console.log('Update successful');
//     console.log("wait")
// // Delay for 1.5 minutes before sending the GET request
// setTimeout(async () => {
// try {
// fetch('https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getSeleniumOutput')
// .then(response => response.json())
// .then(data => {
//   console.log(data);
//   // Iterate over the data array
//   data.forEach(item => {
//     console.log(item.url)
//     console.log(currentURL)
//     if(item.url == currentURL)
//     {
      
//       console.log(item.Submissions)
//       if (item.Submissions && item.Submissions.length > 0) {
//         // Get the last submission from the Submissions array
//         const lastSubmission = item.Submissions[item.Submissions.length - 1];
//         console.log('Last submission:', lastSubmission);
//         const lastSubmissionOutput = lastSubmission.Output;
//         console.log('Last submission output:', lastSubmissionOutput);
//         const outputArea = document.getElementById("result1");
//         const anchorElement = document.createElement("a");
//         anchorElement.href = lastSubmissionOutput;
//         anchorElement.target = "_blank";
//         anchorElement.textContent = lastSubmissionOutput;
//         outputArea.innerHTML = "";
//         outputArea.appendChild(anchorElement);
       
//     } else {
//         console.log('No submissions found');
//     }
//     }
//     });
// })
// .catch(error => console.error(error));
//   // console.log('GET Response:', getResponseData);
// } catch (getError) {
//   console.error('GET Request error:', getError);
// }
// }, 120000); // 1.5 minutes in milliseconds
    
// } else {
//     console.log('Update failed');
// }
// } catch (error) {
// console.error('An error occurred:', error);
// }
// }

// }
});

//submit the code
//submit the code
var submitBtn = document.getElementById('Executebtn');
    submitBtn.addEventListener('click', function() {
        const today = new Date();
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const date_string = today.toLocaleDateString('en-US', options);
        const currentUrl = window.location.href;
        var textareaValue = document.querySelector('textarea[name="code_input"]').value;
        const formattedValue = textareaValue
        .replace(/\n/g, '\\n')
        .replace(/"/g, '\\"');
      
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
               textareaValue: formattedValue,
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
    const myTextarea = document.getElementById("outputTextarea")
    myTextarea.value = data;
    out=data;
    console.log(data); // prints the returned JSON object
  })
  .catch(error => {
    console.error(error);
  });
    });

    //submission dropdown
    dynamic1();
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
        console.log("hello");
        console.log(selectedSubmission.SubmittedCode);
        console.log("hello");
        
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
//question

const questionHeading=document.getElementById("questionHeading");
const questionStatements=document.getElementById("questionStatement");
const paramName = 'name';
const link = document.getElementById('myLink');
const url = new URL(window.location.href);
console.log(url)
//Dynamically populate the Question in Question.html page which are being selected for the user.
const selectElement = document.getElementById("Qyestion");
const apiUrl = "https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getSubmissions"; 
let selectedValue='';
const tabDiv = document.querySelector('#sidebar');
const buttonValues = [];


fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    console.log(data)
    data.forEach(item => {
      console.log(item.url);
      if (item.url == url) {
        console.log("inside question count")
        const count = item.Questions.length;
        console.log(count)
        
        console.log(item.Questions.length);
        console.log(item.Questions)
        updateSidebar(count,item);
        handleSubTabClick(1, item);
  
       }
    });
  });

 

    // function handleSubTabClick(index, item) {
    //   let questionId=item.Questions[index-1]
    //   console.log(item.Questions[index-1])
    //   // Check if the current item has a 'Questions' array
    //   if (item.Questions && item.Questions.length > 0) {
    //     // Check if the index is within the valid range of the 'Questions' array
    //     if (index >= 1 && index <= item.Questions.length) {
    //      fetch('https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getQuestion')
    //   .then(response => response.json())
    //   .then(data => {
    //     data.forEach(item => {
    //       for (let key in item) {
    //         if (item[key].objectId == questionId) {
    //           console.log(item[key].Question);
    //           document.getElementById('questionHeading').innerHTML = `<strong>${item[key].Question}</strong>`;
    //           document.getElementById('questionStatement').innerHTML = item[key]['Question Statement'];
    //           const obj = item[key]['Sample Testcases'];
    //           console.log(obj)
    //           console.log(obj[index-1]['Input'])
    //           document.getElementById('sample_input').innerHTML=`<strong>Example<br> </strong>${obj[0]['Input']}<br>${obj[0]['Output']}<br>`;
    //           document.getElementById('sample_output').innerHTML=`<strong>Example<br> </strong>${obj[1]['Input']}<br>${obj[1]['Output']}<br>`;
            
    //         }
    //       }
    //     });
    //   })
    //   .catch(error => {
    //     console.error("Error fetching data:", error);
    //   });
    //     }
    //   }
    // }
    function handleSubTabClick(index, item) {
      let questionId = item.Questions[index - 1];
      console.log(item.Questions[index - 1]);
    
      // Check if the current item has a 'Questions' array
      if (item.Questions && item.Questions.length > 0) {
        // Check if the index is within the valid range of the 'Questions' array
        if (index >= 1 && index <= item.Questions.length) {
          // Remove 'active' class from all sub-tabs
          document.querySelectorAll('.sub-tab').forEach(tab => {
            tab.classList.remove('active');
          });
    
          // Add 'active' class to the selected sub-tab
          document.querySelector(`.sub-tab[data-index="${index}"]`).classList.add('active');
    
          fetch('https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getQuestion')
            .then(response => response.json())
            .then(data => {
              data.forEach(item => {
                for (let key in item) {
                  if (item[key].objectId == questionId) {
                    console.log(item[key].Question);
                    document.getElementById('questionHeading').innerHTML = `<strong>${item[key].Question}</strong>`;
                    document.getElementById('questionStatement').innerHTML = item[key]['Question Statement'];
                    const obj = item[key]['Sample Testcases'];
                    console.log(obj);
                    console.log(obj[index - 1]['Input']);
                    document.getElementById('sample_input').innerHTML = `<strong>Example<br> </strong>${obj[0]['Input']}<br>${obj[0]['Output']}<br>`;
                    document.getElementById('sample_output').innerHTML = `<strong>Example<br> </strong>${obj[1]['Input']}<br>${obj[1]['Output']}<br>`;
                  }
                }
              });
            })
            .catch(error => {
              console.error("Error fetching data:", error);
            });
        }
      }
    }
    
    function updateSidebar(questionCount, item) {
      const sidebar = document.getElementById('sidebar');
      const numbersContainer = document.querySelector('.numbers-container');
    
      // Clear existing content in the numbers container
      numbersContainer.innerHTML = '';
    
      // Create sub-tabs based on the question count
      for (let i = 1; i <= questionCount; i++) {
        const subTab = document.createElement('div');
        subTab.classList.add('sub-tab');
        // subTab.style.border = '2px solid white';
        // subTab.style.marginRight = '30px'; 
        subTab.textContent = `${i}`;
        subTab.setAttribute('data-index', i);
        subTab.addEventListener('click', () => handleSubTabClick(i, item));
        numbersContainer.appendChild(subTab);
      }
    }

    //profile
    //this code for showing the user info when we click on profile icon
function toggleProfilePopup() {
  console.log("click on profile")
  var profilePopup = document.getElementById('profilePopup');
  var profileContent = document.getElementById('profileContent');

  // Toggle visibility of the popup
  if (profilePopup.style.display === 'none') {
    console.log("inside")
    // Show the popup
    profilePopup.style.display = 'block';

    // Fetch and populate profile data (replace the URL with your API endpoint)
    var currentUrl = window.location.href;
    fetch('https://us-east-1.aws.data.mongodb-api.com/app/application-0-awqqz/endpoint/getAdminTableData')
      .then(response => response.json())
      .then(data => {
        var profileData = data.find(item => item['url'] === currentUrl);
        console.log(profileData)
        if (profileData) {
          profileContent.innerHTML = `Name: ${profileData.Name}<br>Email: ${profileData.Email}`;
        } else {
          profileContent.innerHTML = 'Profile data not found.';
        }
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        profileContent.innerHTML = 'Error fetching profile data.';
      });
  } else {
    // Hide the popup
    profilePopup.style.display = 'none';
    profileContent.innerHTML = ''; // Clear the content when hiding
  }
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("when page load")
  // Set the initial placeholder for the textarea
  var textarea = document.getElementById("code_input");
  var placeholderValue = textarea.getAttribute("placeholder");
  textarea.dataset.initialContent = placeholderValue;



  var languageDropdown = document.getElementById("dropdown");
  languageDropdown.dataset.initialValue =languageDropdown.value;
  console.log(languageDropdown.value)
});
    // Function to reset the textarea and language dropdown to their initial states

    document.getElementById('reset').addEventListener('click', resetForm);    
function resetForm() {
  var textarea = document.getElementById("code_input");
  var languageDropdown = document.getElementById("dropdown");

  // Reset the textarea
  if (textarea.dataset.initialContent !== undefined) {
    textarea.value = textarea.dataset.initialContent;
  } else {
    textarea.value = ""; // Reset to an empty value
  }

  // Reset the language dropdown
  if (languageDropdown.dataset.initialValue !== undefined) {
    languageDropdown.value = languageDropdown.dataset.initialValue;
  } else {
    // Set a default value if not initially set
    languageDropdown.value = "javascript";
  }
}

//expand
function expandTextarea() {
  var codeInput = document.getElementById("code_input");
  var expandedTextarea = document.getElementById("expandedTextarea");
  var popupContainer = document.getElementById("popupContainer");
  var closePopupButton = document.getElementById("closePopupButton");

  // Set the initial value of the expanded textarea
  expandedTextarea.value = codeInput.value;

  // Show the popup
  popupContainer.style.display = "flex";

  // Close the popup when the close button is clicked
  closePopupButton.addEventListener("click", function () {
    // Update the original textarea with the content from the expanded textarea
    codeInput.value = expandedTextarea.value;

    // Hide the popup
    popupContainer.style.display = "none";
  });
}