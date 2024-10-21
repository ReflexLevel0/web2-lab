sudo docker run -p 5242:5242 -e ServerUrl="http://localhost:5242" -it --name web2-api --network host --rm $(docker build -q .)
