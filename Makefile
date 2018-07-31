
PROJECT = "Corrently Invest Token"

all: commit

commit: ;cd ./static && gulp;git add -A;git commit -a -m "Sun build";git push origin master;
