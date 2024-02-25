const FileModel = require('../Models/FileModel');
const catchAsync = require('../utils/catchAsync');

exports.uploadFile = catchAsync(async (request, response, next) => {
  const result = await FileModel.handleFileUpload(request, response);

  if( result.status ) {
    return response.status(result.statusCode).json(result);
  }
});

exports.deleteFile = catchAsync(async (request, response, next) => {
  const result = await FileModel.handleDeleteFile(request, response);

  if( result.status ) {
    return response.status(result.statusCode).json(result);
  }
});

exports.listFiles = catchAsync(async (request, response, next) => {
  const result = await FileModel.handleListFiles(request, response);

  if( result.status ) {
    return response.status(result.statusCode).json(result);
  }
});