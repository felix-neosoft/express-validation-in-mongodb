const express = require('express')
const PORT =8888
const app = express()

//Start Server
app.listen(PORT,err=>{
    if(err) throw err
    console.log(`Server Started at PORT:${PORT}`)
})