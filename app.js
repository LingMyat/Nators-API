const fs = require('fs');
const express = require('express');

const app  = express();
const port = 3000;

app.use(express.json());

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
    const response = {
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    };
    res.status(200).json(response);
};

const getTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = async (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = {id: newId, ...req.body};

    tours.push(newTour);

    await fs.promises.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`, 
        JSON.stringify(tours)
    );

    res.status(201).json({
        status: "success",
        data  : {
            tour: newTour
        }
    });
};

updateTour = (req, res) => {
    const id = parseInt(req.params.id);
    const tour = tours.find(el => el.id === id);

    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    const { name = tour.name, price = tour.price, duration = tour.duration, difficulty = tour.difficulty } = req.body;

    const updatedTour = { ...tour, name, price, duration, difficulty };
    const updatedTours = tours.map(t => (t.id === id ? updatedTour : t));

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(updatedTours),
        err => {
            res.status(200).json({
                status: "success",
                data: {
                    tour: updatedTour
                }
            });
        }
    );
}

deleteTour = (req, res) => {
    const id = req.params.id * 1;

    const targetIndex = tours.findIndex(tour => tour.id === id);

    if (targetIndex === -1) {
        return res.status(404).json({
            status : 'fail',
            message: 'Invalid ID'
        });
    }

    tours.splice(targetIndex, 1);

    fs.writeFileSync(
        `${__dirname}/dev-data/data/tours-simple.json`, 
        JSON.stringify(tours)
    );

    res.status(204).json({
        status: "success",
        data  : null
    });
}

app.route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour);

app.route('/api/v1/tours/:id')
    .get(getTour).patch(updateTour)
    .delete(deleteTour);

app.listen(port, () => {
    console.log(`Server started on 127.0.0.1:${port}`);
});
