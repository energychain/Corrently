
PROJECT = "Corrently Invest Token"

all: commit

dev: ;npm run dev;

commit: ;node index.js && npm run publish && git add -A && git commit -a -m "Sun build" && git push origin master;

update: ;npm run freshen && git add -A && git commit -a -m "Update Build" && git push origin master;
