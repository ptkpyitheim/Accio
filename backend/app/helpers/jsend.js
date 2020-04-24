function sendError(res, err) {
  return res.status(500).send({
    status: "error",
    message: err.message,
    data: {
      stack: err.stack
    }
  });
}

function sendFail(res, code, data) {
  return res.status(code).send({
    status: "fail",
    data: data
  });
}

function sendSuccess(res, data) {
  return res.send({
    status: "success",
    data: data
  });
}

module.exports = {
  sendError: sendError,
  sendFail: sendFail,
  sendSuccess: sendSuccess
}
