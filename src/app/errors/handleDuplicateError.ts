/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const match = err.message.match(/"([^"]+)"/);
  const extractedMsg = match && match[1];
  const errorSources: TErrorSources = [
    {
      path: '',
      message: `${extractedMsg} is already exists`,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: '',
    errorSources,
  };
};

export default handleDuplicateError;
