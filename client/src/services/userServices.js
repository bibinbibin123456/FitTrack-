import { axiosInstance } from "../axios/axiosInstance"


export const userRegistration = (data)=>{
    return axiosInstance.post("/user/register",data)
}
export const userLogin= (data)=>{
    return axiosInstance.post("/user/login",data)
}
export const userLogout = () => axiosInstance.post("/user/logout");
 
export const getAllChallenges= ()=>{
    return axiosInstance.get("/challenge/all")
}

export const joinChallenge =(id)=>{
    return axiosInstance.post(`/challenge/join/${id}`)
}
export const createChallenge= (data)=>{
    return axiosInstance.post("/challenge/create",data)
}
export const getUserWorkouts= ()=>{
    return axiosInstance.get("/addworkout/")
}
export const addWorkout =(data)=>{
    return axiosInstance.post('/addworkout/add',data)
}
export const deleteWorkout=(id)=>{
    return axiosInstance.delete(`/addworkout/${id}`)
}
export const getChallengeLeaderboard = (id) => {
    return axiosInstance.get(`/challenge/${id}/leaderboard`);
};

export const getChallengeProgress = (id) => {
    return axiosInstance.get(`/challenge/${id}/progress`);
};

export const getProfile = () => axiosInstance.get("/user/profile");
export const updateProfile = (data) => axiosInstance.put("/user/profile", data);

export const getFoodEntries = () => axiosInstance.get("/food");
export const addFoodEntry = (data) => axiosInstance.post("/food", data);
export const deleteFoodEntry = (id) => axiosInstance.delete(`/food/${id}`);

export const getCoachAdvice = () => axiosInstance.get("/ai/coach");
export const generateCoachPlan = (data) =>
  axiosInstance.post("/ai/coach", data);

export const adminLogin = (data) => axiosInstance.post("/admin/login", data);
export const getAdminDashboard = () => axiosInstance.get("/admin/dashboard");
export const getAdminUsers = () => axiosInstance.get("/admin/users");
export const deleteAdminUser = (id) => axiosInstance.delete(`/admin/users/${id}`);
export const getAdminChallenges = () => axiosInstance.get("/admin/challenges");
export const deleteAdminChallenge = (id) =>
  axiosInstance.delete(`/admin/challenges/${id}`);