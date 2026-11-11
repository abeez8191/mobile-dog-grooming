docker compose up -d

docker_name=`docker ps --format {{.Names}} | grep web`

docker exec -i $docker_name python manage.py makemigrations
docker exec -i $docker_name python manage.py migrate

echo "Up and running.."
echo "Please head over to http://localhost:8000/ for your application"

