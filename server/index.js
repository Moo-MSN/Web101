// Global Body
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const mysql = require("mysql2/promise");
const cors = require ("cors")

const port = 8000;

app.use(bodyparser.json());
app.use(cors())
// สร้่าง initDatabase เพื่อไม่ต้องประกาศ conn ทุก API
let conn = null;
const initMYSQL = async () => {
  conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "tutorials",
    port: 8889,
  });
};

/* app.get("/testdb", (req, res) => { 
  mysql    ** เป็น promise ที่ใช้กันมานานอาจจะเจอที่หน้างาน แต่เราจะใข้ async, await ในปัจจุบันทำงานเหมือนกันแต่ code จะสวยกว่า
    .createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "tutorials",
      port: 8889,
    })
    .then((conn) => {
      conn
        .query("SELECT * FROM users")
        .then((results) => {
          res.json(results[0]);
        })
        .catch((error) => {
          console.log("Error fetching users", error.message);
          res.status(500).json({ error: "Error fetching users" });
        });
    });
});
*/
// Local Boby
// 1.GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา


app.get("/testdb-new", async (req, res) => {
  try {
    const results = await conn.query("SELECT * FROM users");
    res.json(results[0]);
  } catch (error) {
    console.error("Error fetching users", error.message);
    res.status(500).json({ error: "Error fetching users" });
  }
});


// 2.POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป

app.post("/users", async (req, res) => {
  try {
    let user = req.body;
    const results = await conn.query("INSERT INTO users SET ? ", user);
    res.json({
      message: "insert ok!",
      data: results[0],
    });
  } catch (error) {
    console.error("error message", error.message);
    res.status(500).json({ message: "Someting Wrong" });
  }
});

// 3.GET /users/:id สำหรับการดึง users รายคนออกมา

app.get("/users/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const results = await conn.query("SELECT * FROM users WHERE id = ?", id);

    if (results[0].length > 0) {
      // ทำ if,else ป้องกันการค้นหา id ที่ไม่มีอยู่จริง
      res.json(results[0][0]);
    } else {
      res.status(404).json({
        message: "Not Found",
      });
    }
  } catch (error) {
    console.log("error message", error.message);
    res.status(500).json({ message: "Id not found" });
  }
});

// 4.PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)

app.put("/users/:id", async (req, res) => {
  let id = req.params.id;
  let updateUser = req.body;
  try {
    const results = await conn.query("UPDATE users SET ? WHERE id= ?", [
      updateUser,
      id,
    ]);
    res.json({
      message: "Insert Ok!",
      data: results[0],
    });
  } catch (error) {
    console.log("error message", error.message);
    res.status(404).json({ message: "Not Found" });
  }
});

// 5.DELETE /users/:id สำหรับลบ users รายคน (ตาม id ที่บันทึกไว้)

app.delete("/users/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const results = await conn.query("DELETE FROM users WHERE id=?", id);
    res.json({
      message: "Delete Completed!!!",
      data: results[0],
    });
  } catch (error) {
    console.log("error message", error.message);
    res.status(404).json({ message: "Not Found" });
  }
});

app.listen(port, async (req, res) => {
  //ทำการใส่ async กับ await ตามด้วย initMYSQL() เพื่อรอให้ initMYSQL() ทำงานเสร็จก่อน
  await initMYSQL(); // ไม่งั้นเราจะไม่สามารถดึงข้อมูลออกมาจาก DATABASE ได้
  console.log("http server run at" + port);
});
