package main

import (
    "flag"

    // "fmt"
    "log"
    "net/http"

    "github.com/go-redis/redis"

    // "strconv"
    "time"
    // "github.com/gorilla/websocket"
)

var addr = flag.String("addr", "0.0.0.0:8888", "http service address")

// var upgrader = websocket.Upgrader{} // use default options

var client = redis.NewClient(&redis.Options{
    Addr:     "localhost:6379",
    Password: "", // no password set
    DB:       0,  // use default DB
})

func doEvery(d time.Duration, f func(time.Time)) {
    for x := range time.Tick(d) {
        f(x)
    }
}

func incrementCounter(t time.Time) {
    // fmt.Println(t)
}

func serveHome(w http.ResponseWriter, r *http.Request) {
    log.Println(r.URL)
    if r.URL.Path != "/" {
        http.Error(w, "Not found", http.StatusNotFound)
        return
    }
    if r.Method != "GET" {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }
    http.ServeFile(w, r, "home.html")
}

func clearRedis(w http.ResponseWriter, r *http.Request) {
    client.Set("counter", "[]", 0)
}

func main() {
    flag.Parse()
    hub := newHub()
    go hub.run()
    http.HandleFunc("/", serveHome)
    http.HandleFunc("/clear", clearRedis)
    http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
        serveWs(hub, w, r)
    })
    err := http.ListenAndServe(*addr, nil)
    if err != nil {
        log.Fatal("ListenAndServe: ", err)
    }
}
