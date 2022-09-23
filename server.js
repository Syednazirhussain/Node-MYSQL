require('dotenv-safe').config()

const cors = require('cors')
const i18n = require('i18n')
const path = require('path')
const morgan = require('morgan')
const xss = require('xss-clean')
const helmet = require('helmet')
const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

const app = express()

// Setup express server port from ENV, default: 3000
app.set('port', process.env.PORT || 3000)

const initMySQL = require('./database/mysql')

// Swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Enable only in development HTTP request logger middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Redis cache enabled by env variable
if (process.env.USE_REDIS === 'true') {
  const getExpeditiousCache = require('express-expeditious')
  const cache = getExpeditiousCache({
    namespace: 'expresscache',
    defaultTtl: '1 minute',
    engine: require('expeditious-engine-redis')({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
    })
  })
  app.use(cache)
}

// For parsing json
app.use(
  bodyParser.json({
    limit: '20mb'
  })
)

// For parsing application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    limit: '20mb',
    extended: true
  })
)

// i18n
i18n.configure({
  locales: ['en', 'es'],
  directory: `${__dirname}/locales`,
  defaultLocale: 'en',
  objectNotation: true
})


// Init all other stuff
app.use(xss())
app.use(cors())
app.use(helmet())
app.use(fileUpload())
app.use(compression())
app.use(express.json())
app.use(passport.initialize())
app.use(cookieParser(process.env.JWT_SECRET))


app.use(express.static('public'))
app.use(
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/"))
)
// app.use(
//   express.static(path.join(__dirname, "node_modules/admin-lte"))
// )


app.set('views', path.join(__dirname, 'views'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'ejs');


// Routes
const users = require('./routes/user')
const posts = require('./routes/post')
const auth = require('./routes/auth')


app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/auth', auth);


// index page
app.get('/', (req, res) => {

  var mascots = [
    { name: 'Sammy', organization: "DigitalOcean", birth_year: 2012},
    { name: 'Tux', organization: "Linux", birth_year: 1996},
    { name: 'Moby Dock', organization: "Docker", birth_year: 2013}
  ]
  
  var tagline = "No programming concept is complete without a cute animal mascot."

  res.render('index', {
    mascots: mascots,
    tagline: tagline
  })

})

app.get('/about', (req, res) => {
  res.render('about')
});

app.listen(app.get('port'))

