# ms-users
A microservice for business logic regarding user data.

All installation is done automatically through docker. If you do not have docker installed, install [here](https://docs.docker.com/engine/installation/).

### To Run using Docker Compose (Recommended)
The easiest way to run for production is to use the docker-compose file that can be found [here](https://github.com/molecular-playground/molecular-playground). It is possible however to run the container manually. The following instructions can be used to deploy manually for both production and development environments.

### Setup
This microservice uses environment variables to make it easier to deploy at different locations. You will need to create a file named ```molecular-playground.env``` one level above this directory for deployment to work properly. The following environment variables are used in this microservice:

- ```SIGNING_KEY``` - The key used to sign authentication tokens.
- ```POSTGRES_PASSWORD``` - The password used to connect to the postgres database.
- ```SERVER_URL``` - The URL of the server this microservice is being hosted on.

Below is an example of what your ```molecular-playground.env``` should look like using the above environment variables. ```YOUR_VALUE_HERE``` is simply a placeholder for your own value.
```
SIGNING_KEY=YOUR_VALUE_HERE
POSTGRES_PASSWORD=YOUR_VALUE_HERE
SERVER_URL=YOUR_VALUE_HERE
```

To make sure everything works correctly, make sure you use the same values for each microservice you are using. This can be easily done by using the same molecular-playground.env file.

### To Run Manually (Production)
The easiest way to run for production is to use the docker-compose file that can be found [here](https://github.com/molecular-playground/molecular-playground). It is possible however to run the container manually. Before we begin, make sure you have both the [database](https://github.com/Molecular-Playground/databaes) and the [ms-email](https://github.com/Molecular-Playground/databaes) microservice running in containers. From inside docker virtual machine, navigate to the top directory of this repository. Enter the following commands:
```
docker build -t users .
docker run -d --name users -p 3000:3000 --link postgres:postgres --link email:email --env-file ../molecular-playground.env users
# where the names of the microservice containers are on the left side of the :
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

### To Run Manually (Development)
The easiest way to develop using the docker container is to mount your working directory as a volume. Before we begin, you will still need to make sure you have both the [database](https://github.com/Molecular-Playground/databaes) and the [ms-email](https://github.com/Molecular-Playground/databaes) microservice running in containers. From inside docker virtual machine, navigate to the top directory of this repository. Enter the following commands:
```
docker build -t users .
docker run --rm -i -t -p 3000:3000 --link postgres:postgres --link email:email --env-file ../molecular-playground.env -v $PWD:/src users /bin/sh
# where the names of the microservice containers are on the left side of the :
# where $PWD is a variable to your current directory and may need changing if you are using a windows environment
```

This will run your container 'attached' and leave you in your source directory. All changes you make on your host machine (in this directory) will be present in your container. Run ```npm install``` and ```npm start``` in your container to test, just as if you were only using your host machine. To kill the container from inside the container, type in ```exit```.
