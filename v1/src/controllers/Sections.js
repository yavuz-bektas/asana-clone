const { insert, modify, list, deleteProject } = require("../services/Sections");
const httpStatus = require("http-status");
const res = require("express/lib/response");
const { send, type } = require("express/lib/response");

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
  if (!req?.params?.projectId)
    return res
      .status(http.httpStatus.BAD_REQUEST)
      .send({ error: "proje bilg eksk." });
  list({ project_id: req.params.projectId })
    .then((response) => {
      if (response.length === 0) {
        res.status(httpStatus.OK).send({ message: "Kayıt yok." });
      } else {
        res.status(httpStatus.OK).send(response);
      }
    })
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: e });
    });
};

const update = (req, res, next) => {
  if (!req.params?.id) {
    res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "ID bilgisi eksiktir veya hatalıdır" });
  }
  modify(req.params?.id, req.body)
    .then((updatedDoc) => {
      res.status(httpStatus.OK).send(updatedDoc);
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
