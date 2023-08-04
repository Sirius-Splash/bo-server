let db = require('./data/models').db;


// db.user.create({
//   data: {
//     email: "abcdef@gmail.com",
//     name: "bobby",
//     age: "18",
//     equipment: "false",
//     experience: "1",
//     goals: "be buff",
//     height: "68",
//     online_status: "false",
//     password: "fdasjfweioadks",
//     profile_pic: "",
//     sex: "male",
//     trainer: false,
//     username: "buffman4420",
//     weight: 120,
//   }
// }).then((data) => {
//   console.log(data);
// })
db.user.create({
  data: {
    email: "johndoe@gmail.com",
    name: "john",
    age: 99,
    equipment: true,
    experience: 10,
    goals: "live",
    height: 78,
    online_status: false,
    password: "fdsajfklejai",
    profile_pic: "",
    sex: "male",
    trainer: true,
    username: "jesus",
    weight: 999,
  }
}).then((data) => {
  console.log(data);
})


db.user.findMany({}).then((data) => console.log(data));