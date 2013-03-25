#!/bin/bash

PATH=$HOME/.mozilla/firefox/bomohyhq.default/gm_scripts/server_sided_greasemonke/server_sided_greasemonke.user.js
FILE=greaseTool.server.user.js

/usr/bin/cp $FILE $PATH
for DIR in ./ */; do \
      /usr/bin/mkdir -p $HOME/arquivos/Dropbox/Public/gms/$DIR; \
      /usr/bin/cp $DIR/*.js $HOME/arquivos/Dropbox/Public/gms/$DIR; \
done
