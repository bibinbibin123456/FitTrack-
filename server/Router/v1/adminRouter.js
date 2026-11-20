const {
    adminLogin,
    adminRegister,
    getDashboard,
    getUsers,
    deleteUser,
    getChallenges,
    deleteChallenge
} = require('../../Controllers/adminController')
const adminMiddleware = require('../../middlewares/adminMiddleware')
const { authRateLimit } = require('../../middlewares/rateLimiters')

const adminRouter= require('express').Router()

adminRouter.post("/register", authRateLimit, adminRegister)

adminRouter.post("/login", authRateLimit, adminLogin)
adminRouter.get("/dashboard", adminMiddleware, getDashboard)
adminRouter.get("/users", adminMiddleware, getUsers)
adminRouter.delete("/users/:id", adminMiddleware, deleteUser)
adminRouter.get("/challenges", adminMiddleware, getChallenges)
adminRouter.delete("/challenges/:id", adminMiddleware, deleteChallenge)



module.exports=adminRouter