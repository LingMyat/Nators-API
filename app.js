const fs = require('fs');
const express = require('express');

const app  = express();
const port = 3000;

app.use(express.json());

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours',(req,res) => {
    res.status(200).json({
        status : 'success',
        results: tours.length, 
        data   : {
            tours
        }
    });
});

app.get('/api/v1/tours/:id',(req,res) => {

    const id   = req.params.id * 1;
    const tour = tours.find(el => el.id === id);

    if (!tour) {
        return res.status(404).json({
            status : 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status : 'success', 
        data   : {
            tour
        }
    });
});

app.post('/api/v1/tours', (req,res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);

    tours.push(newTour);

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`, 
        JSON.stringify(tours), 
        err => {
            res.status(201).json({
                status: "success",
                data  : {
                    tour: newTour
                }
            })
        }
    );
});

app.patch('/api/v1/tours/:id', (req, res) => {
    const id   = req.params.id * 1;
    const tour = tours.find(el => el.id === id);

    if (!tour) {
        return res.status(404).json({
            status : 'fail',
            message: 'Invalid ID'
        });
    }
    const request    = req.body;
    const name       = request.name ?? tour.name;
    const price      = request.price ?? tour.price;
    const duration   = request.duration ?? tour.duration;
    const difficulty = request.difficulty ?? tour.difficulty;

    tours.map((tour) => {
        if (tour.id === id) {
            tour.name       = name;
            tour.price      = price;
            tour.duration   = duration;
            tour.difficulty = difficulty;
        }
    });

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`, 
        JSON.stringify(tours), 
        err => {
            res.status(200).json({
                status: "success",
                data  : {
                    tour
                }
            })
        }
    );
});

app.delete('/api/v1/tours/:id', (req, res) => {
    const id = req.params.id * 1;

    if (id>tours.length-1) {
        return res.status(404).json({
            status : 'fail',
            message: 'Invalid ID'
        });
    }

    const targetIndex = tours.findIndex(tour => tour.id === id);
    tours.splice(targetIndex, 1);

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`, 
        JSON.stringify(tours), 
        err => {
            res.status(204).json({
                status: "success",
                data  : null
            })
        }
    );
});

app.listen(port, () => {
    console.log(`Server started on 127.0.0.1:${port}`);
});
