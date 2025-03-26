BASE_URL = "http://localhost:8000";

let mode = "CREATE"; // Defualt
let selectedId = " ";

// ดึงข้อมูล uers ผ่าน GET โดยใช้ id จาก param
window.onload = async () => {
  const urlParam = new URLSearchParams(window.location.search);
  const id = urlParam.get("id");
  console.log("id", id);
  if (id) {
    // ทำการ Checked ว่ามี id ถ้ามี id จะทำการเปลี่ยนเป็น mode = "EDIT"
    mode = "EDIT";
    selectedId = id;

    // 1. เราจะดึงข้อมูล user เก่าออกมาก่อน
    try {
      const response = await axios.get(`${BASE_URL}/users/${id}`);
      const user = response.data; // สร้างตัวแปลเพื่อให้ใช้งานง่าย
      console.log("data", response.data);

      // 2. เราจะนำข้อมูล user กลับใส่เข้าไปใน input html
      let firstnameDOM = document.querySelector("input[name=firstname]");
      let lastnameDOM = document.querySelector("input[name=lastname]");
      let ageDOM = document.querySelector("input[name=age]");
      let descriptionDOM = document.querySelector("textarea[name=description]");
      //ทำการคืนค่า input กลับเข้าไปใน Form
      firstnameDOM.value = user.firstname;
      lastnameDOM.value = user.lastname;
      ageDOM.value = user.age;
      descriptionDOM.value = user.description;

      let genderDOMs = document.querySelectorAll("input[name=gender]");
      // ทำการ loop ว่าตัวไหนมี value ตรงกับ user ให้ทำการแสดงค่านั้นออกมา
      for (let i = 0; i < genderDOMs.length; i++) {
        if (genderDOMs[i].value == user.gender) {
          genderDOMs[i].checked = true;
        }
      }

      let interestDOM = document.querySelectorAll("input[name=interest]");
      // ทำการ loop ว่าตัวไหนมี value ตรงกับ user ให้ทำการแสดงค่านั้นออกมา
      for (let i = 0; i < interestDOM.length; i++) {
        if (user.interests.includes(interestDOM[i].value)) {
          // เราใช้ includes เพราะว่า interests ใส่ได้หลายค่า
          interestDOM[i].checked = true;
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  }
};

// ทำการใส่ validattion
const validateData = (userData) => {
  let errors = [];
  if (!userData.firstname) {
    errors.push("กรุณาใส่ชื่อจริง");
  }
  if (!userData.lastname) {
    errors.push("กรุณาใส่นามสกุล");
  }
  if (!userData.age) {
    errors.push("กรุณาใส่อายุ");
  }
  if (!userData.gender) {
    errors.push("กรุณาระบุเพศ");
  }
  if (!userData.interests) {
    errors.push("กรุณาใส่ความสนใจอย่างน้อย 1 อย่าง");
  }
  return errors;
};

const submitData = async () => {
  let firstnameDOM = document.querySelector("input[name=firstname]");
  let lastnameDOM = document.querySelector("input[name=lastname]");
  let ageDOM = document.querySelector("input[name=age]");

  let genderDOM = document.querySelector("input[name=gender]:checked") || {}; //ใช้ checked เพื่อเลือกเอาที่เรากรอกและไม่ต้องวน loop
  let interestDOM = document.querySelectorAll("input[name=interest]:checked") || {}; // if checked อีกและใส่ {} เพื่อไม่ error ตอนกรอกข้อมูล

  let descriptionDOM = document.querySelector("textarea[name=description]");

  // เพิ่ม response เวลาส่งข้อมูลว่าสำเร็จหรือไม่

  let responseMessageDOM = document.getElementById("response-message");
  try {
    let interest = "";
    for (let i = 0; i < interestDOM.length; i++) {
      interest += interestDOM[i].value;
      if (i != interestDOM.length - 1) {
        // ทำ if เพื่อไม่ให้มี , ในตำแหน่งสุดท้าย
        interest += ",";
      }
    }
    let thisButtonDOM = document.getElementById("thisbutton");
    thisButtonDOM.setAttribute("disabled", "true");

    let userData = {
      firstname: firstnameDOM.value,
      lastname: lastnameDOM.value,
      age: ageDOM.value,
      gender: genderDOM.value,
      description: descriptionDOM.value,
      interests: interest,
    };
    console.log("Submit Data: ", userData);

    const errors = validateData(userData);
    if (errors.length > 0) {
      // มี error เกิดขึ้น จะทำการโยน error ไปให้ error.message เพื่อแสดงออกมาว่ากรอกอะไรไม่ครบ
      throw {
        message: "กรอกข้อมูลไม่ครบ",
        errors: errors,
      };
    }

    // ทำการเปลี่ยนเส้น APIs ของแต่ละตัว
    let message = "เพิ่มข้อมูลเรียบร้อย!!!";
    if (mode == "CREATE") {
      const response = await axios.post(`${BASE_URL}/users`, userData);
      console.log("response", response.data); // เส้นสร้างใหม่
    } else {
      const response = await axios.put(`${BASE_URL}/users/${selectedId}`, userData);
      message = "แก้ไขข้อมูลเรียบร้อยแล้ว!!!";
      console.log("response", response.data); // เส้นแก้ไข
    }
    // หลัง response จาก  axios เรียบร้อย = แสดง error message ออกมา
    responseMessageDOM.innerText = message;
    responseMessageDOM.className = "message success";
  } catch (error) {
    console.log("error message", error.message);
    console.log("error", error.errors);
    //if (error.response) {
    //console.log(error.response.data.message);
    // เกิด error อะไรก็ตาม ให้แสดงว่ามีปัญหาเกิดขึ้นออกมา
    //}

    let htmlData = "<div>";
    htmlData += `<div> ${error.message} </div>`;
    htmlData += "<ul>";
    for (let i = 0; i < error.errors.length; i++) {
      htmlData += `<li>${error.errors[i]}</li>`;
    }
    htmlData += "</ul>";
    htmlData += "</div>";

    responseMessageDOM.innerHTML = htmlData;
    responseMessageDOM.className = "message danger";
  }
};
