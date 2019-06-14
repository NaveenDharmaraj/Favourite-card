const next = require('next')
const routes = require('./routes')
const app = next({dev: true})
const handler = routes.getRequestHandler(app)

// Without express
const {createServer} = require('http')
app.prepare().then(() => {
  createServer(handler).listen(3000)
})