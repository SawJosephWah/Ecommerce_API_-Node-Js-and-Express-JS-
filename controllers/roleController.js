const RoleModel = require('../models/role')
const PermitModel = require('../models/permit')
const CustomError = require('../helpers/customError')

let allRoles = async (req, res, next) => {
    let roles = await RoleModel.find().populate('permits');
    return res.json({ "status": true, "data": roles });
}

let store = async (req, res, next) => {
    const { name } = req.body;
    await new RoleModel({ name }).save();
    return res.json({ "status": true, "msg": "Created role successfully" });
}

let get = async (req, res, next) => {
    const id = req.params.id;
    RoleModel.findById(id)
        .then((role) => {
            if (!role) {
                next(new CustomError('Role not found', 200));
            }

            res.json({ "status": true, "data": role });
        })
        .catch((error) => {
            next(new CustomError('Internal server error'));
        });
}

let update = async (req, res, next) => {
    await RoleModel.findByIdAndUpdate(req.params.id, {
        name: req.body.name
    });
    res.json({ "status": true, "msg": "Updated role successfully" });
}

let deleteRole = async (req, res, next) => {
    await RoleModel.findByIdAndDelete(req.params.id);
    res.json({ "status": true, "msg": "Delete role successfully" });
}

let removePermitFromRole = async (req, res, next) => {
    const roleId = req.body.role_id;
    const permitId = req.body.permit_id;
    const role = await RoleModel.findById(roleId);
    const permit = await PermitModel.findById(permitId);
    if (role && permit) {
        await RoleModel.findByIdAndUpdate(roleId, {
            $pull: { permits: permitId }
        });
        res.json({ "status": true, "msg": "Remove permit from role successfully" });
    } else {
        res.json({ "status": false, "msg": "Data is not found. Check again." });
    }
}
let addPermitToRole = async (req, res, next) => {
    const roleId = req.body.role_id;
    const permitId = req.body.permit_id;
    const role = await RoleModel.findById(roleId);
    if (role.permits.includes(permitId)) {
        return next(new CustomError('Permit already exists in role',200));
    }

    const permit = await PermitModel.findById(permitId);
    if (role && permit) {
        await RoleModel.findByIdAndUpdate(roleId, {
            $push: { permits: permitId }
        });
        return res.json({ "status": true, "msg": "Add permit to role successfully" });
    } else {
        return res.json({ "status": false, "msg": "Data is not found. Check again." });
    }
}

module.exports = {
    allRoles,
    store,
    get,
    update,
    deleteRole,
    addPermitToRole,
    removePermitFromRole
}