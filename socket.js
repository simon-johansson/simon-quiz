
const fs = require('fs');
const socketio = require('socket.io');
const Jimp = require('jimp');
const base64Img = require('base64-img');
const idgen = require('idgen');
const db = require('./db');
const questions = require('./questions');
const isDeveloping = process.env.NODE_ENV !== 'production';
let io;

const saveImg = (base64, filename, callback) => {
  base64Img.img(base64, 'public/images', filename, (err, filepath) => {
    Jimp.read(filepath, (err, img) => {
      if (err) return console.log(err);
      const path = isDeveloping ? './public/images/' : './dist/images/';
      img
        .resize(500, Jimp.AUTO)
        .quality(50)
        .write(path + filename + '.jpg', callback);
    });
  });
};

const onConnection = socket => {
  io.emit('clients', {
    clients: Object.keys(io.clients().sockets).length
  });

  socket.on('answers', (data, callback) => {
    const id = idgen(16);
    let score = 0;

    data.answers.forEach((answer, i) => {
      score += (answer === questions[i].correct) ? 1 : 0;
    });

    callback({
      score: score,
      questions: questions.length
    });

    db.insert({
      name: data.team.name,
      img: data.team.image ? id + '.jpg' : null,
      score: score,
      punchout: data.punchout
    });

    if (data.team.image) {
      saveImg(data.team.image, id, () => {
        io.emit('new score');
      });
    } else {
      io.emit('new score');
    }
  });

  socket.on('clean', (data, callback) => {
    db.remove(() => {
      callback();
    });
  });
};

const init = server => {
  io = socketio(server);
  io.on('connection', onConnection);
  return io;
};

module.exports = {init};
