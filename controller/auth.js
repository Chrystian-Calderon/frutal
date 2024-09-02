module.exports = {
    registerView: (req, res) => {
      res.render('register');
    },
  
    loginView: (req, res) => {
      res.render('login');
    },
  
    registerUser: (req, res) => {
      // TODO: complete
      res.redirect('register');
    },
  
    loginUser: (req, res) => {
      // TODO: complete
      res.redirect('login');
    },
  
    logoutUser: (req, res) => {
      // TODO: complete
      res.redirect('login');
    }
  }

  