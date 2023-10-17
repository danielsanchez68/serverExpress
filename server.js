//https://www.npmjs.com/package/express?activeTab=readme
//https://github.com/expressjs/express
//http://expressjs.com/
//http://expressjs.com/en/4x/api.html

const express = require('express')

let contadorVisitas = 0

const controladorDefault = (req,res) => {
    const { url, method } = req
    console.log('controladorDefault:',url,method)

    res.status(404).send(`
        <h3 style="color:red;">La ruta ${url} del método ${method} no se encontró</h3>
    `)
}

const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())


// ----- middleware personalizado -----
app.use((req,res,next) => {
    const { url, method } = req
    //console.log(url, method)

    if(url == '/' && method == 'GET') contadorVisitas++
    //res.send('Hola soy el middleware personalizado!')
    next()
})

// ----- middleware servicio de recursos estáticos de express -----
app.use(express.static('public'))

//console.log('__dirname:',__dirname)


// ----- middlewares procesadores de las rutas del servidor -----
// -----------------------------------------------------
//             Proceso de las rutas GET
// -----------------------------------------------------
app.get('/', (req,res) => {
    contadorVisitas++
    //res.send('Hola soy el servidor Express')
    res.sendFile(__dirname + '/views/index.html')
})

app.get('/saludo', (req,res) => {
    res.send(`<h4>Hola NodeJS - fyh: ${new Date().toLocaleString()}</h4>`)
})

app.get('/contador', (req,res) => {
    res.send(`<h3 style="color:crimson;">Ud visitó el sitio ${contadorVisitas} ${contadorVisitas > 1?'veces':'vez'}.</h3>`)
})

app.get('/datos/:nombre/:apellido?', (req,res) => {
    //const params = req.params       // route params
    //const query = req.query           // query params
    const headers = req.headers      // headers
    const { params, query } = req    // destructuring object

    res.header('mi-header','qwerty1234')
    res.json({params, query, headers})
})

app.get('*', controladorDefault)

// -----------------------------------------------------
//             Proceso de las rutas POST
// -----------------------------------------------------
app.post('/datos', (req,res) => {
    const body = req.body
    res.json({ body })    // es igual a -> res.json({ body: body })
})

app.post('*', controladorDefault)

// -----------------------------------------------------
//             Proceso de las rutas PUT
// -----------------------------------------------------
app.put('*', controladorDefault)

// -----------------------------------------------------
//             Proceso de las rutas DELETE
// -----------------------------------------------------
app.delete('*', controladorDefault)



const PORT = 8080
const server = app.listen(PORT, () => console.log(`Servidor express escuchando en http://localhost:${PORT}`))
server.on('error', error => console.log(`Error en servidor express: ${error.message}`))


