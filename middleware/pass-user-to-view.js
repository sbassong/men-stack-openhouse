// This middleware needs to handle providing the user object to every view
// It checks whether there is a user object in the session of the request
// If there a user, it stores the use object in the locals object, such that it is
// available to all views
// else it stores null witin the locals object.

const passUserToView = (req, res, next) => {
  // if (req.session.user) {
  //   res.locals.user = req.session.user
  // } else {
  //   res.locals.user = null
  // }
  // ternary version
  res.locals.user = req.session.user ? req.session.user : null

  next()
}

module.exports = passUserToView