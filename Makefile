
PROJECT = "Corrently Invest Token"

all: commit

dev: ; cd ./static && gulp dev;
	
commit: ;cd ./static && gulp;git add -A;git commit -a -m "Sun build";git push origin master;
