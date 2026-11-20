const  userRouter  = require('./userRouter')
const adminRouter  = require('./adminRouter')
const addworkoutRouter = require('./addworkoutRouter')
const challengeRouter = require('./challengeRoutes')
const foodRouter = require('./foodRoutes')
const aiRouter = require('./aiRoutes')


const v1Router= require('express').Router()

v1Router.use("/user",userRouter)
v1Router.use("/admin",adminRouter)
v1Router.use("/addworkout",addworkoutRouter)
v1Router.use("/challenge",challengeRouter)
v1Router.use("/food",foodRouter)
v1Router.use("/ai",aiRouter)




module.exports=v1Router