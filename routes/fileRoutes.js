const express = require('express');
const { protect } = require('../controllers/authController');
const fileController = require('../controllers/fileController');

const Router = express.Router();

Router.use(protect);

Router.route('/upload').post(fileController.uploadFile);
Router.route('/delete').delete(fileController.deleteFile);
Router.route('/list').get(fileController.listFiles);

module.exports = Router;
