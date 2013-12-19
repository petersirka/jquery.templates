ECHO "[COMPILING]"
cd ..
uglifyjs jquery.templates.js -o jquery.templates.min.js
cd minify
node minify.js ../jquery.templates.min.js