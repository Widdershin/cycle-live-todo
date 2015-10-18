import budo from 'budo';
import babelify from 'babelify';

budo('./index.js', {
  live: true,
  port: 8002,
  stream: process.stdout,
  browserify: {
    transform: babelify
  }
});
