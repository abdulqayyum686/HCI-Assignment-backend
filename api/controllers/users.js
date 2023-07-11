const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const saltRounds = 10;

// remove c
module.exports.userLogin = (req, res, next) => {
  console.log(req.body);
  const { email, version } = req.body;

  User.findOne({ email: email, version })
    .exec()
    .then(async (foundObject) => {
      if (foundObject) {
        const token = jwt.sign({ ...foundObject.toObject() }, "secret", {
          expiresIn: "5d",
        });

        return res.status(200).json({
          token: token,
          user: foundObject,
        });
      }
      // await bcrypt.compare(
      //   password,
      //   foundObject.password,
      //   async (err, newResult) => {
      //     if (err) {
      //       return res.status(501).json({ error, err });
      //     } else {
      // if (newResult) {
      // const token = jwt.sign(
      //   { ...foundObject.toObject() },
      //   "secret",
      //   {
      //     expiresIn: "5d",
      //   }
      // );

      // return res.status(200).json({
      //   token: token,
      //   user: foundObject,
      // });
      // } else {
      //   return res.status(401).json({
      //     message: "invalid password",
      //   });
      // }
      else {
        return res.status(404).json({
          message: "Invalid email",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
};
module.exports.addUser = (req, res, next) => {
  console.log(req.body);
  const { email, password, version } = req.body;

  User.findOne({ email: email, version })
    .exec()
    .then(async (foundObject) => {
      if (foundObject) {
        return res.status(403).json({
          message: "Email and version already exist",
        });
      } else {
        // await bcrypt.hash(password, saltRounds, (err, hash) => {
        //   if (err) {
        //     console.log(" error: ", err);
        //     return res.status(500).json({ error: err });
        //   } else {
        let newUser = new User({
          email: email,
          version: version,
          // password: hash,
        });

        newUser
          .save()
          .then(async (savedObject) => {
            console.log("savedObject", savedObject);

            const token = jwt.sign(
              { ...savedObject.toObject(), password: "" },
              "secret",
              {
                expiresIn: "5d",
              }
            );

            return res.status(201).json({
              message: "sign up successful",
              token: token,
            });
          })
          .catch((err) => {
            console.log("Not saved", err);
            res.status(500).json({
              error: err,
            });
          });
        //     }
        //   });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
};
module.exports.getAllUsers = async (req, res, next) => {
  try {
    let users = await User.find();
    return res.status(201).json({
      users,
    });
  } catch (error) {
    return res.status(201).json({
      error,
    });
  }
};
module.exports.getCurrentUser = async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.params.id });
    return res.status(201).json({
      user,
    });
  } catch (error) {
    return res.status(201).json({
      error,
    });
  }
};
