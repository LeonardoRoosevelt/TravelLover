module.exports = {
  authenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    return next()
  },
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {
      if (!req.user.isAdmin) {
        return next()
      }
      req.flash('error_messages', 'permission denied')
      return res.redirect('/')
    }
    return res.redirect('/signin')
  },
  authenticateAdmin: (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) {
        return next()
      }
      req.flash('error_messages', 'permission denied')
      return res.redirect('/')
    }
    return res.redirect('/signin')
  }
}
