# Example

```
# install apollo & graphql modules
npm install
# start the server
node ./server
# start the gateway
node ./gateway
```

Visit http://localhost:6400/graphql

Run this query:

```
query {
  getResource(reference: "ABC1") {
    image(width: 300)
  }
}
```

The gateway will fail on the 'image' field missing the width argument.

The server using federation on http://localhost:6400/graphql considers the request valid, if it is queried directly, but its `query { _service { sdl } }` does not include the arguments on the field definition for image.
