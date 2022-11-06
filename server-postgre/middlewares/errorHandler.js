const errorHandler = (err,req,res,next) => {
  let code = 500
  let message = 'Internal Server Error'
  if (err.name === "SequelizeValidationError"){
    code = 400,
    message = err.errors[0].message
  }else if (err.name === "Match Not Found"){
    code = 404,
    message = "Match not found"
  }else {
    code = 500
    message = "Internal Server Error"
  }
  res.status(code).json({message})
}

module.exports = errorHandler


