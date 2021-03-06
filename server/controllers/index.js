const NodeCache = require('node-cache');
const models = require('../models');

const myCacheProduct = new NodeCache();
const myCacheQuestion = new NodeCache();

module.exports = {
  getQuestions(req, res) {
    if (myCacheProduct.has(req.query.product_id)) {
      res.status(200).send(myCacheProduct.get(req.query.product_id));
    } else {
      const { product_id, page = 1, count = 5 } = req.query;

      models.getQuestions(product_id, page, count)
        .then((result) => {
          const response = !result.rows.length ? result.rows : result.rows[0].row_to_json;
          myCacheProduct.set(req.query.product_id, response);
          res.status(200).json(response);
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    }
  },

  getAnswers(req, res) {
    if (myCacheQuestion.has(req.params.question_id)) {
      res.status(200).send(myCacheQuestion.get(req.params.question_id));
    } else {
      const { question_id } = req.params;
      const { page = 1, count = 5 } = req.query;

      models.getAnswers(question_id, count, page)
        .then((result) => {
          const response = !result.rows.length ? result.rows : result.rows[0].json_build_object;
          myCacheQuestion.set(req.params.question_id, response);
          res.status(200).json(response);
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    }
  },

  postQuestion(req, res) {
    const {
      product_id, body, name, email,
    } = req.body;
    models.postQuestion(product_id, body, name, email)
      .then((result) => res.status(200).send('Question Created'))
      .catch((err) => res.status(500).send(err));
  },

  postAnswer(req, res) {
    const { question_id } = req.params;

    const {
      body, name, email, photos,
    } = req.body;

    models.postAnswer(question_id, body, name, email, photos)
      .then((result) => res.status(200).send('Answer Created'))
      .catch((err) => {
        res.status(500).send(err);
      });
  },

  putQuestionHelpful(req, res) {
    const { question_id } = req.params;

    models.putQuestionHelpful(question_id)
      .then((result) => res.status(204).send('Question Helpful Recorded'))
      .catch((err) => res.status(500).send(err));
  },

  putAnswerHelpful(req, res) {
    const { answer_id } = req.params;

    models.putAnswerHelpful(answer_id)
      .then((result) => res.status(204).send('Answer Helpful Recorded'))
      .catch((err) => res.status(500).send(err));
  },

  putReportQuestion(req, res) {
    const { question_id } = req.params;

    models.putReportQuestion(question_id)
      .then((result) => res.status(204).send('Question Reported'))
      .catch((err) => res.status(500).send(err));
  },

  putReportAnswer(req, res) {
    const { answer_id } = req.params;

    models.putReportAnswer(answer_id)
      .then((result) => res.status(204).send('Answer Reported'))
      .catch((err) => res.status(500).send(err));
  },

};
