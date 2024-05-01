const express = require('express')
const sqlite3 = require('sqlite3')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {open} = require('sqlite')
const {v4}=require('uuid')
const path = require('path')
const dbPath = path.join(__dirname, './data.db')
const app = express()
app.use(express.json())
let db = null
const initializeDBAndServer = async () => {
    try {
    db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
    })
    app.listen(3000, () => {
    console.log('Server is Running at http://localhost:3000/')
    })
} catch (e) {
    console.log(`DB Error:${e.message}`)
    process.exit(1)
}
const createUserTable=`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)`;
db.run(createUserTable,err=>{
    if(err){
        console.log(`error creating user table :${err.message}`);
    }
    else{
        console.log('user table created successfully');
    }
})

const createTaskTable=`CREATE TABLE IF NOT EXISTS TASKS1 (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT,
        description TEXT, status TEXT, assignee_id INTEGER, FOREIGN KEY(assignee_id) REFERENCES users(id))`;
db.run(createTaskTable)
}
initializeDBAndServer()


const authenticate = (request, response, next) => {
    //console.log(request.body)
    const {title,description,status,asignee_id} = request?.body
    const {taskId} = request?.params
    //console.log(tweet, tweetId)
    let jwtToken
    const authHead = request.headers['authorization']

    if (authHead === undefined) {
        response.status(401)
        response.send(`Invalid JWT Token
        You Dont have access to perform this action`)
    } else {
        jwtToken = authHead.split(' ')[1]
        if (jwtToken === undefined) {
        response.status(401)
        response.send(`Invalid JWT Token
        You Dont have access to perform this action`)
    } else {
        jwt.verify(jwtToken, 'SECRET', async (error, payload) => {
            console.log("PAY",payload);
            if (error) {
            response.status(401)
            response.send(`Invalid JWT Token
            You Dont have access to perform this action`)
            } else {
            request.payload = payload
            request.taskId = taskId
            request.title = title 
            request.description=description
            request.status=status
            request.asignee_id=asignee_id
            next()
            }
        })
    }
    }
}

app.post('/register/', async (request, response) => {
    const {username, password} = request.body
    
    const hashedPassword = await bcrypt.hash(request.body.password, 10)
    const getUserQuery = `select * from users where username='${username}';`
    const user = await db.get(getUserQuery)
    if (user === undefined && password.length >= 6) {
        const createUserQuery = `
        INSERT INTO 
        users (username,password) 
        VALUES 
        (
            '${id}', 
            '${username}',
            '${hashedPassword}'            
        );`
    const dbResponse = await db.run(createUserQuery)
    response.status(200)
    response.send('User created successfully')
    } else if (password.length < 6) {
        response.status(400)
        response.send('Password is too short')
    } else {
        response.status(400)
        response.send('User already exists')
    }
})


app.post('/login/', async (request, response) => {
    const {username, password} = request.body
    let jwtToken
    let payload
    const userQuery = `select * from users where username='${username}';`
    const user = await db.get(userQuery)
    
    if (user === undefined) {
    response.status(400)
    response.send('Invalid user')
    } else {
        const validatePassword = await bcrypt.compare(password, user.password)
        if (validatePassword === false) {
        response.status(400)
        response.send('Invalid password')
    } else {
        jwtToken = jwt.sign(user, 'SECRET')
        response.send({jwtToken: jwtToken})
    }
    }
})


app.post('/tasks/', authenticate,async (request, response) => {
    
    const {body} = request
    console.log("REQ",body);
    const{title,description,status,asignee_id}=body
    
    
    
    console.log("ANS",title,description,status,asignee_id);
    const postTaskQuery = `insert into TASKS1(title,description,status,assignee_id) values('${title}','${description}','${status}',${asignee_id});`
    await db.run(postTaskQuery)
    response.send('Created a Task')
})




app.get('/tasks/', async (request, response) => {
    const taskQuery = `select * from TASKS1 ;`
    const taskResult = await db.get(taskQuery)
    response.send(taskResult)
  
});

app.get('/tasks/:taskId/',async (request, response) => {
    const {taskId} = request.params
    const taskQuery = `select * from TASKS1 where id=${taskId};`
    const taskResult = await db.get(taskQuery)
    response.send(taskResult)
  
});

app.put('/tasks/:taskId/',async (request, response) => {
    const {body} = request
    const{title,description,status,asignee_id}=body
    const updateQuery = `update TASKS1 set  title='${title}' title='${title}', description='${description}' status='${status}' assignee_id=${asignee_id} where id=${taskId};`
    await db.get(updateQuery)
    response.send("Updated Succesfully")

});

app.delete('/tasks/:taskId/',async (request, response) => {
    const {taskId} = request.params
    const taskQuery = `delete  from TASKS1 where id=${taskId};`
    const taskResult = await db.get(taskQuery)
    response.send("Deleted Succesfully")
  
});
