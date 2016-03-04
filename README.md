# ms-users
A microservice for business logic regarding user data.

All installation is done automatically through docker. If you do not have docker installed, install [here](https://docs.docker.com/engine/installation/).

### To Run (Production)
The easiest way to run for production is to use the docker-compose file that can be found [here](https://github.com/molecular-playground/molecular-playground). It is possible however to run the container manually. Before we begin, make sure you have the database running in a container. You can find instructions on how to do that [here](https://github.com/Molecular-Playground/databaes). From inside docker virtual machine, navigate to the top directory of this repository. Enter the following commands:
```
docker build -t users .
docker run -d --name users -p 3000:3000 --link postgres:postgres users
# where the left postgres is the name of your postgres container
```

This will run your container 'detached'. Here are some useful commands to interact with a detached container:
```
# kill a container
docker kill users

# view output
docker logs -f users

# restart a container
docker restart -t=0 users
```

### To Run (Development)
The easiest way to develop using the docker container is to mount your working directory as a volume. Before we begin, you will still need to make sure you have the database running in a container. You can find instructions on how to do that [here](https://github.com/Molecular-Playground/databaes). From inside docker virtual machine, navigate to the top directory of this repository. Enter the following commands:
```
docker build -t users .
docker run --name users -p 3000:3000 -v $PWD:/src --link postgres:postgres users
# where the left postgres is the name of your postgres container
# where $PWD is a variable to your current directory and may need changing if you are using a windows environment
```

This will run your container 'attached' and leave you in your source directory. All changes you make on your host machine (in this directory) will be present in your container. Run ```npm install``` and ```npm start``` in your container to test, just as if you were only using your host machine. To kill the container from inside the container, type in ```exit```.
