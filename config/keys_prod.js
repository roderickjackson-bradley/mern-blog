

// Keys

// Since my password is in the string, I'd like to had this in a .env file
module.exports = {
  mongoURI: process.env.MONGO_URI,
  secretOrKey: process.env.SECRET
}