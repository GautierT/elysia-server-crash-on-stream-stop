This is fixed by https://bun.sh/blog/bun-v1.1.34#fixed-readablestream-spec-updates


## With Bun (Crash)

Run 

`bun run start-bun`

Call POST /

```
curl --location --request POST 'http://localhost:3000'
```

then cancel the request. (ctrl+c)

Server will crash.


## With Node (Okay)

With node it's working

Run 

`bun run start-node`

Call POST /

```
curl --location --request POST 'http://localhost:3000'
```

then cancel the request. (ctrl+c)

Server is okay.
