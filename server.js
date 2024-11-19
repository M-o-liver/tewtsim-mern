const next = require('next')
const express = require('express')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  // Handle API routes
  server.use('/api', (req, res, next) => {
    return handle(req, res)
  })

  // Handle all other routes
  server.all('*', (req, res) => {
    return handle(req, res)
  })

  const port = process.env.PORT || 3000
  server.listen(port, () => {
    console.log(`> Ready on port ${port}`)
  })
})
