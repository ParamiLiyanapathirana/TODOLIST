const express= require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()

const TodoModel = require('./Models/ToDo')

app.use(cors())
app.use(express.json())


mongoose.connect('mongodb://127.0.0.1:27017/todoappdb')


/*app.get('/get', (req, res)=>{
    TodoModel.find()
    .then(result => res.json(result))
    .catch(err => res.json(err))
})
*/
app.get('/get', (req, res) => {
    TodoModel.find()
        .then(result => {
            console.log('GET request successful:', result); // Log the result to check if data is being fetched
            res.json(result);
        })
        .catch(err => {
            console.error('Error fetching tasks:', err); // Log any errors that occur
            res.status(500).json(err); // Send a 500 status code for server errors
        });
});


app.post('/add',(req, res )=> {
    const task = req.body.task;
    TodoModel.create({
        task : task

    }).then(result => res.json(result))
    .catch(err => res.json(err))


})





app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { task } = req.body;

    TodoModel.findByIdAndUpdate(id, { task: task }, { new: true })
      .then(result => res.json(result))
      .catch(err => res.status(500).json(err));
});

app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
  
    TodoModel.findByIdAndDelete(id)
      .then(result => {
        if (result) {
          res.json({ message: 'Task deleted successfully' });
        } else {
          res.status(404).json({ message: 'Task not found' });
        }
      })
      .catch(err => res.status(500).json(err));
  });

  
app.listen(3001, () => {
    console.log("Server is running")
})