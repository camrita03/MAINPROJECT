const jwt=require("jsonwebtoken")
const dotenv=require("dotenv")
dotenv.config()

const generateToken = (id) => {
  console.log("JWT_SECRET:", process.env.JWT_SECRET);
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports=generateToken;