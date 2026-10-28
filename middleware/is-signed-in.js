// This middleware needed to check whether the user is logged in
// by looking at the session.user off of the req
// If there is a user, we exit the middleware and call/invoke/trigger the next function
// else we redirect the user to the sign in page so they can authenticate/sign in

const isSignedIn = (req, res, next) => {
  if (req.session.user) return next();
  res.redirect("/auth/sign-in");
};

// Then we export the middleware function to be used in the app/server
module.exports = isSignedIn;
