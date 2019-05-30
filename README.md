# Realtime Video Segment Sharing

Websockets + Videos + Go!

# Running

First things first - you need to startup a redis datastore. We'll use docker so we can start the service with on command.
```
docker run --name some-redis -p 6379:6379 -d redis 
```

## Quick Setup

Open two terminals 

![the webapp on desktop](/images/terminals.png)

#### Terminal A
```
cd webapp
yarn start
```

#### Terminal B
```
cd server
go run main.go hub.go client.go
```

Now open as many instances of the UI at `http://localhost:3000/` 

![the webapp on desktop](/images/app.png)

# Building

### Building Production

*the webapp*

```
cd webapp
yarn build
```
this might take some time but the webpacked/static files will be located in `build` 


you can server those published files with the following command

```
yarn global add serve
serve -s build
```

*the server*

```
cd server
go build -o server main.go hub.go client.go
./server
```