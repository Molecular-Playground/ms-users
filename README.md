# ms-users
A microservice for business logic regarding user data.

All installation is done automatically through docker. If you do not have docker installed, install [here](https://docs.docker.com/engine/installation/).

### To Run
Before we begin, make sure you have the database running in a container. You can find instructions on how to do that [here](https://github.com/Molecular-Playground/databaes). From inside docker virtual machine, navigate to the top directory of this repository. Enter the following commands:
```
docker build -t users .
docker run -tiv ~/Documents/ms-users:/src -p 3000:3000 --name users --link postgres:postgres users
# where the left postgres is the name of your postgres container
```
### To Restart
To restart the container with new code, simply run ```docker restart users```
