Watch for [Main Repository](https://github.com/aronei44/docker-laravel-nextjs-mysql)

# Cetan App
Cetan app is an aplication for realtime chatting

# Requirement

- Git Bash
- Docker Desktop
- Email Account for sending mail with smtp. (need email and apps password). save it in env

# Installation

```
git clone https://github.com/candradimuka-community/cetan.git
cd cetan
cp .env.sample .env
docker-compose up --build -d
```

you dont have a database migrated. now you can running artisan command like below

# Running artisan command

you can running artisan command by :

```
docker container exec php php artisan command
```

example for get route list:

```
docker container exec php php artisan route:list
```

# ++ Feature

- Hot Reload NextJs. you dont need rebuild container in development

# Development

- For frontend, use port 80 or you just need open 127.0.0.1 or http://localhost

- For backend, use port 8000 or you just need open 127.0.0.1:8000 or http://localhost:8000

- For documentaion,  open 127.0.0.1:8000/api/documentation or http://localhost:8000/api/documentation


# Contributing

you can contribute by clone this repo, create some changes and create PR

please dont change any dockerfile or docker-compose if you dont know about them

Thanks
