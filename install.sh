# curl -LJO https://github.com/abeez8191/mobile-dog-grooming/install.sh | bash

getPassword() {
    printf "Enter password: "

    stty_orig=$(stty -g)
    trap 'stty "$stty_orig"' EXIT INT TERM

    stty -echo
    read -r password
    stty echo 
    echo
    printf "Confirm password: "

    stty -echo
    read -r confirmPassword
    stty echo
    echo

    trap - EXIT INT TERM
}

# if [ ! -f "main.zip" ]; then
#     curl -LJO https://github.com/abeez8191/mobile-dog-grooming/archive/refs/heads/main.zip
#     if [ $? ne 0 ]; then
#         echo "Unable to download repository. Please download the zip from the URL below, manually move it to this folder, and run the command again." >&2
#         echo "https://github.com/abeez8191/mobile-dog-grooming/archive/refs/heads/main.zip" >&2
#         exit 1
#     fi
# fi

# unzip mobile-dog-grooming-main.zip

# cd mobile-dog-grooming-main

if command -v docker >/dev/null 2>&1; then
    docker build -t mobile-dog-grooming-web:latest --no-cache .
    docker compose up -d --no-build
    docker_name=`docker ps --format {{.Names}} | grep mobile-dog-grooming-web`

    docker exec -i $docker_name python ../mobile_dog_grooming_app/manage.py makemigrations
    docker exec -i $docker_name python ../mobile_dog_grooming_app/manage.py migrate
    read -p "Enter admin email: " email
    
    password=
    confirmPassword=

    getPassword

    while [ "$password" != "$confirmPassword" ];do
        echo
        echo "Passwords do not match. Try again."
        getPassword
    done

    docker exec -e DJANGO_SUPERUSER_PASSWORD="$password" -i $docker_name python ../mobile_dog_grooming_app/manage.py createsuperuser --noinput --email $email
    docker exec -i $docker_name chown -R www-data:www-data /var/log/django

    echo "You can start the application by typing 'cd mobile-dog-grooming-main && sh run.sh'"
else
    echo "Docker is not installed. Please install docker before continuing" >&2
    echo "https://docs.docker.com/engine/install/" >&2
    exit 1
fi