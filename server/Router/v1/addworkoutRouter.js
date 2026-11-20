const express= require('express')
const { addworkout, getWorkout, updateWorkout, deleteWorkout } = require('../../Controllers/workoutController')
const authMiddleware = require('../../middlewares/authMiddleware')

const addworkoutRouter= express.Router()

addworkoutRouter.post('/add',authMiddleware ,addworkout)

addworkoutRouter.get('/',authMiddleware,getWorkout)

addworkoutRouter.put('/:id',authMiddleware,updateWorkout)

addworkoutRouter.delete('/:id',authMiddleware,deleteWorkout)



module.exports= addworkoutRouter