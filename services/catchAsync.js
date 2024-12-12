// catching asynchronous error
// anonymous higher order function that takes function paramter and returns another function
// function can be any from the controller 
// autamaticall taking any argument as fn and return error message immidiately not causing server crash


module.exports = (fn) => {
    return (req, res, next) => {
        // Ensure fn returns a promise
        // the parameter function receiveing error will catch error and return error
        Promise.resolve(fn(req, res, next)).catch((err) => {
            return res.status(500).json({
                message: err.message,
                error: err
            });
        });
    };
};