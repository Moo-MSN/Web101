const BASE_URL = "http://localhost:8000";



window.onload = async () => {
  await loadData();
};

const loadData = async () => {
  // 1. Load user ทั้งหมดออกมาจาก API
  const response = await axios.get(`${BASE_URL}/testdb-new`);
  console.log(response.data);

  const userDOM = document.getElementById("user");
  let htmlData = "<div>";
  // 2. นำ user ที่โหลดมาใส่กลับเข้าไปใน html
  for (let i = 0; i < response.data.length; i++) {
    let user = response.data[i]; // Qurry Param เราจะใส่เพื่อทำการ update ในหน้า register โดยจะใส่ ?id= ต่อท้าย
    htmlData += `<div>
      ${user.id}. ${user.firstname} - ${user.lastname} ->>
      <a href = "index.html?id=${user.id}"><button>Edit</button></a> 
      <button class = "delete" data-id = "${user.id}">Delete</button>
      </div>`;
  }
  htmlData += "</div>";
  userDOM.innerHTML = htmlData;

  // button class = "delete"
  const deleteDOMs = document.getElementsByClassName("delete");
  for (let i = 0; i < deleteDOMs.length; i++) {
    deleteDOMs[i].addEventListener("click", async (event) => {
      const id = event.target.dataset.id;
      try {
        await axios.delete(`${BASE_URL}/users/${id}`);
        loadData(); // recursive fuction = เรียก fuction ตัวเองอีกรอบ
      } catch (error) {
        console.log("error", error);
      }
    });
  }
};
