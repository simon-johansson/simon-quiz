
import $ from 'jquery';
import EXIF from 'exif-js';

const socket = io('');
let base64IMG;

const getAnswers = () => {
  const answers = [];
  $('.alternatives').each((index, el) => {
    const val = $(`input[name=question-${index}]:checked`).val();
    answers.push(val ? parseInt(val) : null);
  });
  return answers;
};

const getTeamName = () => $('#team-name').val();

$('.button-send').on('click', () => {
    $('.button-send')
      .off('click')
      .addClass('disabled');

  const payload = {
    answers: getAnswers(),
    punchout: $('#punchout').val(),
    team: {
      name: getTeamName(),
      image: base64IMG
    }
  };

  console.log(payload);

  socket.emit('answers', payload, (data) => {
    $('body').css({
      height: '100%',
      overflow: 'hidden',
      width: '100%',
      position: 'fixed'
    });

    $('.score-overlay')
      .addClass('show')
      .find('.score')
      .text(`${data.score} / ${data.questions}`);
  });
});

function readURL(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();

    reader.onload = function(e) {
      base64IMG = e.target.result;

      $('.custom-file-upload').hide();

      $('#avatar')
        .attr('src', e.target.result)
        .show();
    };

    reader.readAsDataURL(input.files[0]);
  }
}

$('#team-picture').change(function(){
  readURL(this);
});

window.outputUpdate = vol => {
  document.querySelector('#volume').value = vol;
};
