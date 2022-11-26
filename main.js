let btn = document.querySelector(".btn");
let inpName = document.querySelector(".task-input-1");
let inpEmail = document.querySelector(".task-input-2");
let inpPhone = document.querySelector(".task-input-3");
let img = document.querySelector(".task-input-4");
let list = document.querySelector(".task-list");
const API = "http://localhost:8000/task";

btn.addEventListener("click", () => {
  // ! проверка на заполненость input
  if (
    !inpName.value.trim() ||
    !inpEmail.value.trim() ||
    !inpPhone.value.trim() ||
    !inpEmail.value.trim() ||
    !img.value.trim()
  ) {
    return alert(`Заполните поле!`);
  }
  if (isNaN(inpPhone.value)) {
    return alert(`Водите коректо Phone Number!(только числа)`);
  }

  let obj = {
    taskName: inpName.value,
    taskEmail: inpEmail.value,
    taskPhone: inpPhone.value,
    img2: img.value,
  };

  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  });

  setItemToStorage(obj);
  readElement(); //выззов функции для отображения данных
  inpName.value = "";
  inpEmail.value = "";
  inpPhone.value = "";
  img.value = "";
});

function setItemToStorage(obj) {
  let data = JSON.parse(localStorage.getItem("table-data"));
  data.push(obj);
  localStorage.setItem("table-data", JSON.stringify(data));
}

function readElement() {
  list.innerHTML =
    '<tr><th id="number">ФОТО РАБА</th><th>ИМЯ</th><th>Email Address</th><th>Phone number</th>' +
    "<th>Delete</th><th>Edit</th></tr>";

  fetch(API)
    .then((resolve) => resolve.json())
    .then((info) => {
      console.log(info);
      info.forEach((elem) => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
        <td class="img1" style="background: url(${elem.img2})"></td> 
        <td>${elem.taskName}</td>
        <td>${elem.taskEmail}</td>
        <td>${elem.taskPhone}</td>`;
        list.append(tr);
        let btnDelete = document.createElement("button");
        btnDelete.innerText = "Удалить";
        let td1 = document.createElement("td");
        td1.append(btnDelete);
        tr.appendChild(td1);
        btnDelete.addEventListener("click", () => {
          deleteElement(elem.id);
        });
        let btnEdit = document.createElement("button");
        btnEdit.innerText = "Редактировать";
        let td = document.createElement("td");
        td.append(btnEdit);
        tr.appendChild(td);
        btnEdit.addEventListener("click", () => {
          editElement(elem.id);
        });
      });
    })
    .catch((error) => console.log(error, "Ошибка"));
}

function deleteElement(index) {
  fetch(`${API}/${index}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json;" + "charset=utf-8",
    },
  });
  readElement();
}

let mainModal = document.querySelector(".main-modal");
let inpNameEdit = document.querySelector(".inp-name");
let inpEmailEdit = document.querySelector(".inp-email");
let inpPhoneEdit = document.querySelector(".inp-phone");
let inpImg = document.querySelector(".inp-img");
let btnCloser = document.querySelector(".btn-closer");
let btnSave = document.querySelector(".btn-save");

function editElement(index) {
  mainModal.style.display = "block";
  fetch(API)
    .then((res) => res.json())
    .then((elem) => {
      elem.forEach((info) => {
        if (index === info.id) 
        inpNameEdit.value = info.taskName;
        inpEmailEdit.value = info.taskEmail;
        inpPhoneEdit.value = info.taskPhone;
        inpImg.value = info.img2
      });
    });
}

btnSave.addEventListener("click", () => {
  if (
    !inpNameEdit.value.trim() ||
    !inpEmailEdit.value.trim() ||
    !inpPhoneEdit.value.trim() ||
    !inpEmailEdit.value.trim() ||
    !inpImg.value.trim()
  ) {
    return alert(`Заполните поле!`);
  }
  let index = inpNameEdit.id;
  let newObj = {
    taskName: inpNameEdit.value,
    taskEmail: inpEmailEdit.value,
    taskPhone: inpPhoneEdit.value,
    img2: inpImg.value,
  };
  fetch(`${API}/${index}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;" + "charset=utf-8",
    },
    body: JSON.stringify(newObj),
  });
  mainModal.style.display = "none";
  readElement();
});

btnCloser.addEventListener("click", () => {
  mainModal.style.display = "none";
});

readElement();
