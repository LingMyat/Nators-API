const fs = require('fs');

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
    if (val > tours.length) {
        return res.status(404).json({
          status: 'fail',
          message: 'Invalid ID',
        });
    }

    next();
}

exports.getAllTours = (req, res) => {
    const response = {
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    };
    res.status(200).json(response);
};

exports.getTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = async (req, res) => {
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

exports.updateTour = (req, res) => {
    const id = parseInt(req.params.id);
    const tour = tours.find(el => el.id === id);

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

exports.deleteTour = (req, res) => {
    const id = req.params.id * 1;

    const targetIndex = tours.findIndex(tour => tour.id === id);

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