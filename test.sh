#! /bin/sh
PATH=${PATH}:/home/bohdan/.nvm/v0.10.36/bin

forever stopall
node /srv/www/demo.bohdananderson.com/main.js
