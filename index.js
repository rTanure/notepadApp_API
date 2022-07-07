const express = require("express")
const app = express()

const cors = require('cors')

const PORT = process.env.PORT || 8080

app.use(express.json())
app.use(cors({
    origin: "http://localhost:3000"
}))

var notesList = [
    {
        "id": 0,
        "title": "Titulo",
        "author": "0",
        "content": "Essa nota é so asfdasdfasdfpara me lembrar de descascar banana",
        "creationDate": "2022-05-28T22:34:33.492Z",
        "updateDate": "2022-05-28T22:34:33.492Z"
    },
    {
        "id": 1,
        "title": "Titulo",
        "author": "1",
        "content": "Essa nota é so asfdasdfasdfpara me lembrar de descascar banana",
        "creationDate": "2022-05-28T22:34:33.659Z",
        "updateDate": "2022-05-28T22:34:33.659Z"
    },
    {
        "id": 2,
        "title": "Titulo",
        "author": "2",
        "content": "Essa nota é so asfdasdfasdfpara me lembrar de descascar banana",
        "creationDate": "2022-05-28T22:34:33.847Z",
        "updateDate": "2022-05-28T22:34:33.847Z"
    },
    {
        "id": 3,
        "title": "Titulo",
        "author": "3",
        "content": "Essa nota é so asfdasdfasdfpara me lembrar de descascar banana",
        "creationDate": "2022-05-28T22:34:33.862Z",
        "updateDate": "2022-05-28T22:34:33.862Z"
    },
]

function getIndexByID(id) {
    for(index in notesList) {
        if(Number(notesList[index].id) === Number(id)) {
            return index
        } 
    }
}

function isTheAuthor(id, author) {
    let index = getIndexByID(id)
    if(notesList[index].author === author) {
        return true
    } 
}

// Obter todos os resultados da API
app.route('/api').get((req, res)=>{
    res.send({
        "message": "API conectada com sucesso!!!",
        "type": "success"
    })
})

// Obter apenas os dados das anotações
app.route('/api/notes').get((req, res)=>{
    res.send({
        "message": "A requisição pelas notas foi atendida;",
        "type": "success",
        "data": notesList
    })
})

app.route('/api/note/:id').get((req, res)=>{
    const index = getIndexByID(req.params.id)
    console.log(index)
    if (index != undefined) {
        res.send({
            "message": `A nota ${req.params.id} foi acessada com uscesso`,
            "type": "success",
            "data": notesList[index]
        })
    } else {
        res.send({
            "message": `A nota ${req.params.id} não foi encontrada no banco de dados`,
            "type": "error"
        })
    }
    
})

// Add a new note
app.route('/api/notes').post((req,res)=>{
    let values = {
        "title": req.body.title,
        "author": req.body.author,
        "content": req.body.content,
    }

    if(values.title.length > 0 && values.author.length > 0 && values.content.length > 0) {
        let newNoteData = {
            "id": notesList.length > 0 ? notesList[notesList.length -1].id + 1 : 0,
            "title": values.title,
            "author": values.author,
            "content": values.content,
            "creationDate": new Date(),
            "updateDate": new Date()
        }
        notesList.push(newNoteData)
        res.send({
            "message": "Anotação salva com sucesso!",
            "type": "success",
            "data": notesList
        })
    } else {
        res.send({
            "message": "Os campos do formulário devem ser preenchidos corretamente!",
            "type": "error"
        })
    }
})



app.route('/api/notes/:id').put((req, res)=>{
    let noteId = req.params.id
    let noteIndex = getIndexByID(noteId)

    let newBody = req.body

    if(isTheAuthor(noteId, newBody.author)) {
        notesList[noteIndex].title = newBody.title
        notesList[noteIndex].content = newBody.content
        notesList[noteIndex].updateDate = new Date()

        res.send({
            "message": "Alteração feita com sucesso!",
            "type": "success",
            "content": notesList
        })
    } else {
        res.send({
            "message": "Você precisa ser o autor da nota para edita-la",
            "type": "error"
        })
    }
})

app.route('/api/notes/:id/:author').delete((req, res)=>{
    
    let noteId = req.params.id
    let deleterAuthor = req.params.author

    if(isTheAuthor(noteId, deleterAuthor)) {
        notesList = notesList.filter(note => notesList = Number(note.id) !== Number(noteId))
        res.send({
            "message": "Nota apagada com sucesso!",
            "type": "success",
            "data": notesList
        })
    } else {
        res.send({
            "message": "Você precisa ser o autor da nota para edita-la",
            "type": "error"
        })
    }
    
})

app.listen(PORT, () => console.log(`Server is running in port ${PORT}`))