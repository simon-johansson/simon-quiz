
import $ from 'jquery';
const socket = io('');
const refreshInterval = 1800000; // 30 minutes

socket.on('new score', data => {
  location.reload();
});

socket.on('disconnect', () => {
  location.reload();
});

setTimeout(() => {
  location.reload();
}, refreshInterval);

$('#clean').on('click', () => {

  if (confirm('Sure?')) {
    socket.emit('clean', {}, () => {
      location.reload();
    });
  }
});
