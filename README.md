# Next.js Teslo Shop
Para correr localmente, se necesita la base de datos

```
docker-compose up -d
```
* El -d, significa __detached__

## Configurar las variables de entorno
Renombrar el archivo __.env.template__  a __.env__

MongoDB URL Local:
```
mongodb://localhost:27017/teslodb
```

* Reconstruir los módulos de node y levantar Next
```
yarn install
yarn dev

```

## Llenar la base de datos con informacion de pruebas

llamar a:

```
http://localhost:3000/api/seed

```