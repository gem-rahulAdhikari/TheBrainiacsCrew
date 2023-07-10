const urlGenerate = document.querySelectorAll('#url_generate');

// Loop through the buttons and add a click event listener to each one
urlGenerate.forEach(button => {
  button.addEventListener('click', () => {
    const rowId = button.dataset.id;
  const data = {
    id: rowId,
  };
  fetch('/my-flask-route', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.text())
  .then(html => {
    // Replace the current page with the new HTML page
    document.open();
    document.write(html);
    document.close();
  })
  .catch(error => {
    console.error(error);
    alert('Error fetching data: ' + error);
  });
  });
});

//-------------------
// const search = document.querySelector('.input-group input'),
// const search=document.getElementById('search')
// table_rows = document.querySelectorAll('tbody tr'),
// table_headings = document.querySelectorAll('thead th');


// 2. Sorting | Ordering data of HTML table

// table_headings.forEach((head, i) => {
// let sort_asc = true;
// head.onclick = () => {
//     table_headings.forEach(head => head.classList.remove('active'));
//     head.classList.add('active');

//     document.querySelectorAll('td').forEach(td => td.classList.remove('active'));
//     table_rows.forEach(row => {
//         row.querySelectorAll('td')[i].classList.add('active');
//     })
//     head.classList.toggle('asc', sort_asc);
//     sort_asc = head.classList.contains('asc') ? false : true;
//     console.log(i);
//     sortTable(i, sort_asc);
// }
// })


// function sortTable(column, sort_asc) {
//   console.log(column);
//   console.log(table_rows);
// [...table_rows].sort((a, b) => {
//     let first_row = a.querySelectorAll('td')[column].textContent.toLowerCase(),
//         second_row = b.querySelectorAll('td')[column].textContent.toLowerCase();
//         console.log(first_row);
        

//     return sort_asc ? (first_row < second_row ? -1 : 1) : (first_row < second_row ? 1 : -1);
// })
//     .map(sorted_row => document.querySelector('tbody').appendChild(sorted_row));
// }


function searchTable() {
  // Declare variables
  console.log("hello this is search");
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("dataTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those that don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[3]; // Change 0 to the index of the column you want to search
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }

}





