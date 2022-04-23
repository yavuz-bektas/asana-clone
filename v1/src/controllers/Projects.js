const { insert, modify, list, deleteProject } = require("../services/Projects");
const httpStatus = require("http-status");
const res = require("express/lib/response");
const { send } = require("express/lib/response");

const create = (req, res) => {
  req.body.user_id = req.user;
  insert(req.body)
    .then((response) => {
      res.status(httpStatus.CREATED).send(response);
    })
    .catch((error) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
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

const update = (req, res, next) => {
  if (!req.params?.id) {
    res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "ID bilgisi eksiktir veya hatalıdır" });
  }
  modify(req.params?.id, req.body)
    .then((updatedProject) => {
      res.status(httpStatus.OK).send(updatedProject);
    })
    .catch((err) => {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: "kayit sırasında bir sorun oldu" });
    });
};

const remove = (req, res) => {
  if (!req.params?.id) {
    res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "ID bilgisi eksiktir veya hatalıdır" });
  }
  deleteProject(req.params?.id)
    .then((deletedProject) => {
      if (!deletedProject) {
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: "Böyle bir kayıt yoktur" });
      } else {
        res.status(httpStatus.OK).send({ message: "proje silindi." });
      }
    })
    .catch((err) => {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: "silme işlemi sırasında bir sorun oldu" });
    });
};

module.exports = {
  create,
  index,
  update,
  remove,
};
