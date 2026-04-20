const express=require("express")
const upload = require("../middleware/uploadmiddleware")
const {protect}=require("../middleware/authMiddleware")
const {analyzeResume}=require("../controllers/resumeController")
const router = express.Router();


router.post("/upload", upload.single("resume"), analyzeResume);


module.exports=router
