sudo docker run -p 5242:5242 -it --name web2-api --network host --rm $(docker build -q .)
