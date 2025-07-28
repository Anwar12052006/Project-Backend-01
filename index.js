const express = require("express");
const fs = require("fs");
const users = require("./dummy_data.json");

const app = express();
const PORT = 8000;

//Middleware -plugin
app.use(express.urlencoded({ extended: false}));

//Routes
app.get("/users", (req, res) => {
    const html = `
    <ul>
        ${users.map(user => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
    res.send(html);
});
//Rest api
app.get("/api/users", (req, res) => {
    return res.json(users);
});

app.route("/api/users/:id").get((req, res) => {
 const id = Number(req.params.id);
    const user = users.find(user => user.id === id);
    return res.json(user);
})
.patch((req, res) =>   {
    //Edit user with ID
    return res.json({status: "pending"})
})
.delete((req, res) => {
      //Delete user with ID
    return res.json({status: "pending"})
});


app.post("/api/users", (req, res) => {
    //TODO: Create new user
    const body = req.body;
    users.push({...body, id: users.length+1});
    fs.writeFile("./dummy_data.json", JSON.stringify(users), (err, data) =>{
        return res.json({status: "success", id: users.length});
    });
});

// app.patch("/api/users/:id", (req, res) => {
//     //TODO: Edit the user with id
//     return res.json({status: "pending"});
// });

// app.delete("/api/users/:id", (req, res) => {
//     //TODO: Delete the user with id
//     return res.json({status: "pending"});
// });

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`))