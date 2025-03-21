import { HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

const sendBadRequest = (msg = 'Bad Request') => {
  throw new HttpException(
    {
      error: 'Bad Request',
      message: msg,
    },
    HttpStatus.BAD_REQUEST,
  );
};

const sendUnauthorized = (msg = 'Unauthorized') => {
  throw new HttpException(
    {
      error: 'Unauthorized',
      message: msg,
    },
    HttpStatus.UNAUTHORIZED,
  );
};

const sendSuccess = (message = 'Success', data, meta = {}) => {
  return {
    message,
    data,
    meta: meta,
  };
};

const sendSystemError = (res: Response, err: any, msg = 'System error.') => {
  return res.send({
    code: 500,
    msg: msg,
    err: err,
  });
};

const sendError = (msg = 'Error!') => {
  throw new HttpException(
    {
      error: 'Error',
      message: msg,
    },
    HttpStatus.NOT_ACCEPTABLE,
  );
};

const sendErrorFromMicroservice = (message: string, err: any) => {
  return {
    message,
    err,
  };
};

export {
  sendBadRequest,
  sendSuccess,
  sendSystemError,
  sendError,
  sendUnauthorized,
  sendErrorFromMicroservice,
};
