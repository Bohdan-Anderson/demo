#! /bin/sh
PATH=${PATH}:/home/bohdan/.nvm/v0.10.36/bin

forever list
forever start /srv/www/demo.bohdananderson.com/app/app.js
