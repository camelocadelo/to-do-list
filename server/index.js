const express = require('express');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

let tasks = [];
let currentId = 1;

app.get('/tasks', (req, res) => {
    const { date } = req.query;
    if (!date) {
        return res.status(400).json({ message: 'Параметр "date" обязателен' });
    }
    const tasksForDate = tasks.filter(task => task.date === date);
    res.json(tasksForDate);
});

app.post('/tasks', (req, res) => {
    const { title, date } = req.body;
    if (!title || !date) {
        return res.status(400).json({ message: 'Поля "title" и "date" обязательны' });
    }
    const newTask = { id: currentId++, title, date, completed: false };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    tasks = tasks.filter(task => task.id !== id);
    res.status(204).send();
});

app.get('/calendar', (req, res) => {
    const taskCounts = tasks.reduce((acc, task) => {
        acc[task.date] = (acc[task.date] || 0) + 1;
        return acc;
    }, {});
    res.json(taskCounts);
});

// Сброс данных (только для тестов)
app.post('/reset', (req, res) => {
    tasks = [];
    currentId = 1;
    res.status(200).send('Данные сброшены');
});


const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Mock server is running on http://localhost:${PORT}`);
    console.log(`Swagger UI is available at http://localhost:${PORT}/api-docs`);
});
