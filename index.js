const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
// const users = require("./dummy_data.json");

const app = express();
const PORT = 8000;

//Connection mongodb
mongoose
.connect("mongodb://127.0.0.1:27017/youtube-app-1")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log("Mongo Error", err));

//Schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    jobTitle: {
        type: String,
    },
    gender: {
        type: String,
    },
 }, { timestamps: true }
);


const User = mongoose.model("user", userSchema);


//Middleware -plugin
app.use(express.urlencoded({ extended: false}));

app.use((req, res, next) => {
    console.log("Hello from middleware 1");
    // return res.json({ msg: "Hello from middleware 1"});
    next();
});

app.use((req, res, next) => {
    console.log("Hello from middleware 2");
    //db query
    //create card info
    // req.creditCardNumber = "123";
    next();
});

//Routes
app.get("/users", async (req, res) => {
    const allDbUsers = await User.find({});
    const html = `
    <ul>
        ${allDbUsers.map(user => `<li>${user.firstName} -${user.email}</li>`).join("")}
    </ul>
    `;
    res.send(html);
});
//Rest api
app.get("/api/users", async(req, res) => {
    const allDbUsers = await User.find({});

    return res.json(allDbUsers);
});

app.route("/api/users/:id").get(async(req, res) => {
    const user = await User.findById(req.params.id)
    if(!user) return res.status(404).json({ error: "user not found"});
    return res.json(user);
})
.patch(async(req, res) =>   {
    await User.findByIdAndUpdate(req.params.id, { lastName: "Changes" });
    return res.json({status: "Success"})
})
.delete(async(req, res) => {
    await User.findByIdAndDelete(req.params.id,)
    return res.json({status: "Success"})
});


app.post("/api/users", async(req, res) => {
    //TODO: Create new user
    const body = req.body;
    if (
        !body ||
        !body.first_name ||
        !body.last_name ||
        !body.email ||
        !body.gender ||
        !body.job_title
    ) {
        return res.status(400).json({ msg: "All fields are req..."});
    }
    
    const result = await User.create({
        firstName: body.first_name,
        lastName: body.last_name,
        email: body.email,
        gender: body.gender,
        jobTitle: body.job_title,
    });

    console.log("result", result);

    return res.status(201).json({ msg: "success" });

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