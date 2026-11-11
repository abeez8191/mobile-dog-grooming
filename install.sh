# curl -LJO https://github.com/abeez8191/mobile-dog-grooming/install.sh | bash

if [ ! -f "main.zip" ]; then
    curl -LJO https://github.com/abeez8191/mobile-dog-grooming/archive/refs/heads/main.zip
    if [ $? ne 0 ]; then
        echo "Unable to download repository. Please download the zip from the URL below, manually move it to this folder, and run the command again." >&2
        echo "https://github.com/abeez8191/mobile-dog-grooming/archive/refs/heads/main.zip" >&2
        exit 1
    fi
fi

unzip mobile-dog-grooming-main.zip

cd mobile-dog-grooming-main/backend

if command -v docker >/dev/null 2>&1; then
    docker compose build --no-cache
    echo "You can start the application by typing 'sh run.sh'"
else
    echo "Docker is not installed. Please install docker before continuing" >&2
    echo "https://docs.docker.com/engine/install/" >&2
    exit 1
fi
