const prisma = require("../models/index.js").db

module.exports.getWorkouts = async (req,res) => {
  console.log('in GET workouts CONTROLLER')
  console.log(req.data)
  console.log(req.body)
  console.log(req.params)
  res.send('GET WORKOUTS HAHAHAHA')
}
module.exports.postWorkout = async (req,res) => {
  console.log('in POST workouts CONTROLLER')
  console.log(req.body)
  let exerArr = req.body.exercises;
  let id = req.body.user_id;

  // pastWorkoutId
  prisma.pastWorkout.create({
    data: {
      user_id: id
    }
  }).then((data)=>{
    console.log(data)
    let arr = []
    exerArr.forEach((val)=>{
      arr.push({
        exercise_name: val.exercise.name,
        set: val.set,
        rep: val.rep,
        pastWorkoutId: data.id
      })
    });
    console.log(data.id)
    console.log(arr)
    prisma.exercise.createMany({
      data: arr
    }).then(()=>{res.sendStatus(200)})
    .catch((err)=>{res.sendStatus(500); console.log('inside ', err)})
  }).catch((err)=>{res.sendStatus(500); console.log('outside ',err)})
}
