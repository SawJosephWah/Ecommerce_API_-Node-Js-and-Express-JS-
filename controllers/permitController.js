const PermitModel = require('../models/permit')
const CustomError = require('../helpers/customError')

let allPermits = async (req, res, next) => {
    let permits = await PermitModel.find();
    return res.json({ "status": true, "data": permits });
}

let store = async (req, res, next) => {
    const { name } = req.body;
    await new PermitModel({ name }).save();
    return res.json({ "status": true, "msg": "Created permit successfully" });
}

let get = async (req, res, next) => {
    const id = req.params.id;
    PermitModel.findById(id)
        .then((permit) => {
            if (!permit) {
                next(new CustomError('Permit not found', 200));
            }

            res.json({ "status": true, "data": permit });
        })
        .catch((error) => {
            next(new CustomError('Internal server error'));
        });
}

let update = async (req, res, next) => {
    await PermitModel.findByIdAndUpdate(req.params.id, {
        name: req.body.name
    });
    res.json({ "status": true, "msg": "Updated permit successfully" });
}

let deletePermit = async (req,res,next) => {
    await PermitModel.findByIdAndDelete(req.params.id);
    res.json({ "status": true, "msg": "Delete permit successfully" });
}


module.exports = {
    allPermits,
    store,
    get,
    update,
    deletePermit
}