const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const cors = require('cors')

const authRoutes = require('./routes/authRoutes')
const issueRoutes = require("./routes/issueRoutes")
const dashRoutes = require('./routes/dashboardRoutes')

dotenv.config()

const app = express()
app.use(express.json())
connectDB()

app.use(cors({
    origin: '*',
    credentials: true
}))
app.use('/api/auth', authRoutes)
app.use('/api/issues', issueRoutes)
app.use('/api/dashboard', dashRoutes)


app.get('/', (req, res)=>{
    res.send('Server is running')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})