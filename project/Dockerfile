FROM python:3.15-slim

# Prevent Python from writing pyc files and buffering stdout/stderr
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Install Apache and mod_wsgi module
RUN apt-get update && apt-get install -y --no-install-recommends \
    apache2 \
    apache2-dev \
    #libapache2-mod-wsgi-py3 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory inside the container
WORKDIR /var/www/mobile_dog_grooming_app

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# couldn't install libapache2-mod-wsgi-py3 using the package manager since python
# versions were getting all messed up. So instead found a way to have pip install
# the correct wsgi modules and this command adds the wsgi configurations to apache
# to allow us to enable it further down.
RUN mod_wsgi-express module-config >/etc/apache2/mods-available/wsgi.load

# Copy Apache configuration and enable it
COPY ./apache/apache.conf /etc/apache2/sites-available/apache.conf
RUN a2dissite 000-default.conf && a2ensite apache.conf && a2enmod wsgi

# Copy the Django code
COPY ./mobile_dog_grooming_app/ .

# Run collectstatic to prepare the static file path for Apache
RUN python manage.py collectstatic --noinput

# Expose HTTP port
EXPOSE 80

# Start Apache in the foreground so the container stays active
CMD ["apache2ctl", "-D", "FOREGROUND"]
