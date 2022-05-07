const {
  insert,
  list,
  loginUser,
  modify,
  removeUser,
} = require("../services/Users");
const projectService = require("../services/Projects");
const httpStatus = require("http-status");
const uuid = require("uuid");
const eventEmitter = require("../scripts/events/eventEmitter");
const path = require("path");

const {
  passwordToHash,
  generateAccessToken,
  generateRefreshToken,
} = require("../scripts/utils/helper");
const res = require("express/lib/response");

const create = (req, res) => {
  req.body.password = passwordToHash(req.body.password);

  insert(req.body)
    .then((response) => {
      res.status(httpStatus.CREATED).send(response);
    })
    .catch((error) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
    });
};

const login = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  loginUser(req.body)
    .then((user) => {
      if (!user)
        return res.status(httpStatus.NOT_FOUND).send({ msg: "kullanıcı yok" });

      user = {
        ...user.toObject(),
        tokens: {
          access_token: generateAccessToken(user),
          refresh_token: generateRefreshToken(user),
        },
      };
      delete user.password;
      res.status(httpStatus.OK).send(user);
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    });
};

const index = (req, res) => {
  list()
    .then((response) => {
      res.status(httpStatus.OK).send(response);
    })
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

const projectList = (req, res) => {
  projectService
    .list({ user_id: req.user?._id })
    .then((result) => {
      res.status(httpStatus.OK).send(result);
    })
    .catch((err) => {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ err: "Projeleri getirirken hata oldu" });
    });
};

const resetPassword = (req, res) => {
  const newPwd = uuid.v1()?.split("-")[0] || new Date().getTime();
  console.log(newPwd);
  modify({ email: req.body.email }, { password: passwordToHash(newPwd) })
    .then((updatedUser) => {
      if (!updatedUser)
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ error: "Böyle bir kullanıcı bulunamadı." });
      eventEmitter.emit("send_email", {
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: updatedUser.email, // list of receivers
        subject: "Şifre Sıfırlama", // Subject line
        html: "yeni şifreniz --> " + newPwd, // html body
      });
      res.status(httpStatus.OK).send({
        message: "şifre sıfırlama maili gönderildi",
      });
    })
    .catch((err) => {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: " şifre sıfırlama sırasında bi hata oldu" });
    });
};

const update = (req, res) => {
  modify({ _id: req.user?._id }, req.body)
    .then((updatedUser) => {
      res.status(httpStatus.OK).send(updatedUser);
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    });
};

const changePassword = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  modify({ _id: req.user?._id }, req.body)
    .then((updatedUser) => {
      res.status(httpStatus.OK).send(updatedUser);
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    });
};

const remove = (req, res) => {
  if (!req.params?.id) {
    res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "ID bilgisi eksiktir veya hatalıdır" });
  }
  removeUser(req.params?.id)
    .then((deletedUser) => {
      if (!deletedUser) {
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: "Böyle bir kayıt yoktur" });
      } else {
        res
          .status(httpStatus.OK)
          .send({ message: "kullanıcı silindi. ==>" + deletedUser.full_name });
      }
    })
    .catch((err) => {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: "silme işlemi sırasında bir sorun oldu" });
    });
};

const updateProfileImage = (req, res) => {
  // resim kontrol
  if (!req?.files?.profile_image) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ error: "doğru dosya yükleyiniz" });
  }

  // upload islemi
  const extension = path.extname(req.files.profile_image.name);
  const fileName = req?.user._id + extension;
  const folderPath = path.join(__dirname, "../", "uploads/users", fileName);
  req.files.profile_image.mv(folderPath, function (err) {
    if (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err });
    } else {
      modify({ _id: req.user._id }, { profile_image: fileName })
        .then((updatedUser) => {
          res.status(httpStatus.OK).send(updatedUser);
        })
        .catch((err) => {
          res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .send({ error: "kayıt olamadı..!!" });
        });
    }
  });

  // db save islemi
  // response
};

module.exports = {
  create,
  index,
  login,
  projectList,
  resetPassword,
  update,
  remove,
  changePassword,
  updateProfileImage,
};
