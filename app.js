import express from 'express'
import session from 'express-session'

const app = express()
const port = 8080


app.set('view enging', 'pug')
app.use(express.static('assets'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))



app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`)
})