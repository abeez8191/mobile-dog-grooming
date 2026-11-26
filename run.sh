docker compose up -d --no-build

docker_name=`docker ps --format {{.Names}} | grep mobile-dog-grooming-web`

docker exec -i $docker_name python ../mobile_dog_grooming_app/manage.py makemigrations
docker exec -i $docker_name python ../mobile_dog_grooming_app/manage.py migrate
docker exec -i $docker_name chown -R www-data:www-data /var/log/django

echo "Up and running.."
echo "Please head over to http://localhost:8000/ for your application"

