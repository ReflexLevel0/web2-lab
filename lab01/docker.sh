docker run -p 5432:5432 -it --name web2-db --network web2 --rm $(docker build -q .)
