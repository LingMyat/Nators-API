exports.storeTour = (req, res, next) => {
    const { name, price, duration } = req.body;

    const errors = {};

    if (!name) errors.name = ['Name is required'];
    if (!price) errors.price = ['Price is required'];
    if (!duration) errors.duration = ['Duration is required'];

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
    }

    next();
}
