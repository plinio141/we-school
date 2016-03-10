var objectUser = require('./models/user'); //Import database model
var console = require('console-prefix');
var fs = require('fs.extra');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

module.exports = function(app, passport) {
// =====================================
// USERS ROUTES ======================
// =====================================

  app.get('/users', isLoggedIn, function(req, res) {

    objectUser.find({},function(err, objectUser) {
      if (err) {
        return res.send(err);
      }

      //objectUser:objectUser exports model user to the template
      //user:req.user exports logged user info to the template
      //message:req.flash exports personalized alerts
      res.render('users.ejs',{ 
        objectUser:objectUser,
        user:req.user,
        message:req.flash('signupMessage')
      });
    });
  });


  //Para subir una sola imagen se puede usar upload.single
  app.post("/createUser", upload.array('photos',3), function(req,res){

    var datetime = new Date();
    var email = req.body.email;
    var users = new objectUser();

    objectUser.findOne({ 'local.email' :  email }, function(err, user) {
        // if there are any errors, return the error
        if (err)
          return done(err);

        // check to see if theres already a user with that email
        if (user) {
          //alert("El email ingresado ya se encuentra registrado");
          //console.dir("El email ingresado ya se encuentra registrado");
          return res.end("El email ingresado ya se encuentra registrado");
          //res.redirect('/users');
          //return req.flash('signupMessage', 'El email ingresado ya se encuentra registrado')
        } else {

          users.local.code     = req.body.code;
          users.local.email    = req.body.email;
          users.local.password = users.generateHash(req.body.password); //Encrypt password
          users.local.role     = req.body.role;
          users.local.name     = req.body.name;
          users.local.status   = req.body.status;

          //Save user
          users.save(function(err) {
            if(err) {
              console.dir(err);
              alert("Error creando usuario");
              res.redirect('/users');
            } else {
              console.log('user: ' + users.local.email + " saved.");
              res.redirect('/users');
            }
          });
        }
    });
  });


  //Recibe como parametro un Id y devuelve un objeto User
  app.get('/get-user/:id', function(req, res) {

    var id = req.param("id");

    //Busca en la BD un usuario con el Id ingresado como parametro
    objectUser.findById(id, function(err, user) {
      if (err) throw err;

      user.save(function(err) {
        if (err) {
            res.send('error');
        }
        else {
            res.send(user); //Retorna el objeto User
        }
      });
    });

  });


  //Recibe como parametro un Id y modifica el objeto User relacionado
  app.post('/modifyUser/:id', function(req, res) {

    var id = req.param("id");
    var users = new objectUser();

    //Busca en la BD un usuario con el Id ingresado como parametro
    objectUser.findById(id, function(err, user) {
      if (err) throw err;

      //console.dir(req.body);

      //Reemplaza la información del usuario
      user.local.code     = req.body.code;
      user.local.email    = req.body.email;
      user.local.password = users.generateHash(req.body.password); //Encrypt password
      user.local.role     = req.body.role;
      user.local.name     = req.body.name;
      user.local.status   = req.body.status;

      //Guarda las modificaciones y redirige a la vista /users
      user.save(function(err) {
        if (err) {
          res.end('error');
          res.redirect('/users');
        }
        else {
          res.redirect('/users');
        }
      });

    });
  });


  //Recibe como parametro un Id y elimina el objeto User relacionado
  app.get('/destroyUser/:id', function(req, res) {
    var id = req.param("id");

    objectUser.remove({
        _id: id
    },function(err){
        if (err) {
            res.end('error');
            console.dir(err);
        }
        else {
            res.end('success');
        }
    });
  });

  // route middleware to make sure
  function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
      return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
  }

};