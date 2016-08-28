
import FastClick from 'fastclick';
FastClick.attach(document.body);

require('scss/main.scss');

if (window.location.pathname.indexOf('highscore') !== -1) {
    require('./highscore');
} else {
    require('./mobile');
}
