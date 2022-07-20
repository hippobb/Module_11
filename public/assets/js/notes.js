const $noteForm = document.querySelector('#note-form');
const $displayArea = document.querySelector('#display-area');
const $headerArea = document.querySelector('#headerTitle');

let arrayData={};

const printResults = resultArr => {

  const titleHTML = resultArr.map(({ id, title }) => {
    return `

    <button class="btn card p-4 " id="${id}">${title}</button>

    `;
  });

  $displayArea.innerHTML = titleHTML.join('');
};

const getnotes = (formData = {}) => {
  let queryUrl = '/api/notes?';

  Object.entries(formData).forEach(([key, value]) => {
    queryUrl += `${key}=${value}&`;
  });

  fetch(queryUrl)
    .then(response => {
      if (!response.ok) {
        return alert('Error: ' + response.statusText);
      }
      return response.json();
    })
    .then(noteData => {
      console.log(noteData);
      arrayData=noteData;
      printResults(noteData);
    });
};

const handleGetnotesSubmit = event => {
  event.preventDefault();  
  const id=event.target.hid;
  const title = document.getElementById("title").value;
  const detail = document.getElementById("detail").value;
  let noteObject = {};
  let url="";
  console.log(document.getElementById("btn_save").btype);
  if (document.getElementById("btn_save").btype=='old'){
    url='/api/oldnotes';
    noteObject = {id,title, detail};
  }
  else{
    url='/api/notes';
    noteObject = {title, detail};
  }

  fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(noteObject)
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      alert(`Error: ${response.statusText}`);
    })
    .then(postResponse => {
      getnotes();
      document.getElementById("title").value="";
      document.getElementById("detail").value="";
      document.getElementById("btn_save").hid="";
      document.getElementById("btn_save").setAttribute("style" , "none");
      document.getElementById("btn_delete").setAttribute("style" , "none");
      document.getElementById("btn_save").btype='new';
    });
    
};



const handleDelete = event => {

  event.preventDefault();  
  const id=document.getElementById("btn_save").hid;
    url='/api/notes/'+id;
    console.log(url);
  fetch(url, {
    method: 'DELETE',
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      alert(`Error: ${response.statusText}`);
    })
    .then(postResponse => {
      getnotes();
      document.getElementById("title").value="";
      document.getElementById("detail").value="";
      document.getElementById("btn_save").hid="";
      document.getElementById("btn_save").setAttribute("style" , "none");
      document.getElementById("btn_delete").setAttribute("style" , "none");
      document.getElementById("btn_save").btype='new';
    });
    
};

const titleButtonHandler = event => {

  event.preventDefault();  
  checkUsers = arrayData.filter(user => user.id == event.target.id);
  console.log(checkUsers[0].id);
  document.getElementById("btn_save").setAttribute("style" , "display:flex");
  document.getElementById("btn_delete").setAttribute("style" , "display:flex");
  document.getElementById("btn_save").hid=checkUsers[0].id; 
  document.getElementById("title").value=checkUsers[0].title;
  document.getElementById("detail").value=checkUsers[0].detail;
  document.getElementById("btn_save").btype='old';
};

const titleboxHandler = event => {

  event.preventDefault();  
  document.getElementById("btn_save").setAttribute("style" , "display:flex");
};

const handleNew = event => {

  event.preventDefault();
  document.getElementById("title").value="";
  document.getElementById("detail").value="";
  document.getElementById("btn_save").hid="";
  document.getElementById("btn_save").setAttribute("style" , "none");
  document.getElementById("btn_delete").setAttribute("style" , "none");
  document.getElementById("btn_save").btype='new';
};

$displayArea.addEventListener('click', titleButtonHandler);
document.getElementById("title").addEventListener('input', titleboxHandler);
document.getElementById("btn_save").addEventListener('click', handleGetnotesSubmit);
document.getElementById("btn_delete").addEventListener('click', handleDelete);
document.getElementById("btn_new").addEventListener('click', handleNew);
getnotes();
