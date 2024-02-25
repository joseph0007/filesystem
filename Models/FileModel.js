const fs = require('node:fs');
const path = require('node:path');
const multer = require('multer');

function handleFileName( request, file, callback ) {
  let temp_file_arr = file.originalname.split(".");
  let temp_file_name = temp_file_arr[0];
  let temp_file_extension = temp_file_arr[1];

  callback(null, temp_file_name + '-' + Date.now() + '.' + temp_file_extension);
}

function handleDestination( request, file, callback ) {
  callback(null, './upload');
}

exports.handleFileUpload = async (request, response) => {
  return new Promise(( resolve, reject ) => {
    const storage = multer.diskStorage({
      destination: handleDestination,
      filename: handleFileName
    });
  
    let upload = multer({ storage: storage }).single('file');
  
    upload(request, response, function (error) {
      if (error || !request.file) {
        reject({
          statusCode: 400,
          status: false,
          message: `File upload failed`,
          error: error ? error.message : ''
        });
      }
      else {
        resolve({
          statusCode: 200,
          status: true,
          message: `File uploaded successfully => ${request.file.filename}`
        });
      }
    });
  });
}

exports.handleDeleteFile = async (request, response) => {
  return new Promise(( resolve, reject ) => {
    if( typeof request.body !== 'object' || !request.body.filename ) {
      reject({
        statusCode: 400,
        status: false,
        message: `File not found`,
        error: ''
      });
    }

    const filename = path.basename(request.body.filename);
    const filepath = `${__dirname}/../upload/${filename}`;

    if(!fs.existsSync(filepath)) {
      reject({
        statusCode: 400,
        status: false,
        message: `File not found`,
        error: ''
      });
    }

    fs.unlink(filepath, (err) => {
      if( err ) {
        reject({
          statusCode: 400,
          status: false,
          message: `File deletion failed`,
          error: err
        });
      }

      resolve({
        statusCode: 200,
        status: true,
        message: `File deletion successful`,
        error: err
      });
    })
  });
}

exports.handleListFiles = async (request, response) => {
  return new Promise(( resolve, reject ) => {

    fs.readdir(`${__dirname}/../upload/`, (err, files) => {
      if( err ) {
        reject({
          statusCode: 400,
          status: false,
          message: `File listing failed`,
          error: err
        });
      }

      resolve({
        statusCode: 200,
        status: true,
        message: files,
        error: ''
      });
    });
  });
}