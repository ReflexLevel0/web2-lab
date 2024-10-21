docker run -p 5432:5432 -it --name web2-db --network host --rm $(docker build -q .)
