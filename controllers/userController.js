const UserModel = require('../models/user');
const RoleModel = require('../models/role');
const PermitModel = require('../models/permit');
const helper = require('../utils/helper');
const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();
const CustomError = require('../helpers/customError');

const store = async (req, res, next) => {
    let { name, phone, email, password } = req.body;
    password = await helper.generatePasswordHash(password);
    await new UserModel({ name, phone, email, password }).save();
    return res.json({ status: true, msg: "User registered successfully" });
}

const login = async (req, res, next) => {
    let user = await UserModel.findOne({ phone: req.body.phone }).populate({
        path: 'roles',
        select: 'name'
    }).populate({
        path: 'permits',
        select: 'name'
    });
    if (user) {
        user = user.toObject();
        let check = await helper.checkPassword(req.body.password, user.password);
        if (check) {
            delete user.password;
            userString = JSON.stringify(user);
            let userId = JSON.stringify(user._id);
            await client.set(userId, userString);
            token = helper.generateToken(user);
            return res.json({ status: true, msg: "User logined successfully", data: { ...user, token } });
        } else {
            return res.json({ status: false, msg: "Credencials error" });
        }
    } else {
        return res.json({ status: false, msg: "Credencials error" });
    }

}

const addRoleToUser = async (req, res, next) => {
    let userId = req.body.user_id;
    let roleId = req.body.role_id;

    let user = await UserModel.findOne({ _id: userId });
    let role = await RoleModel.findOne({ _id: roleId });

    if (user && role) {
        let userRoles = user.toObject().roles;
        const exists = userRoles.some(roleId => roleId.equals(role._id));
        if (exists) {
            return next(new CustomError("Role already exists", 200));
        };
        await user.updateOne({ $push: { roles: role._id } });

        return res.json({ status: true, msg: "Added role to user successfully" });
    }
}

const removeRoleFromUser = async (req, res, next) => {
    let userId = req.body.user_id;
    let roleId = req.body.role_id;

    let user = await UserModel.findOne({ _id: userId });
    let role = await RoleModel.findOne({ _id: roleId });


    if (user && role) {
        let userRoles = user.toObject().roles;
        const exists = userRoles.some(roleId => roleId.equals(role._id));
        if (!exists) {
            return next(new CustomError("Role does not exist in this user", 200));
        };
        await user.updateOne({ $pull: { roles: role._id } });

        return res.json({ status: true, msg: "Removed role from user successfully" });
    }
}

const addPermitToUser = async (req, res, next) => {
    let userId = req.body.user_id;
    let permitId = req.body.permit_id;

    let user = await UserModel.findOne({ _id: userId });
    let permit = await PermitModel.findOne({ _id: permitId });

    if (user && permit) {
        let userPermits = user.toObject().permits;
        const exists = userPermits.some(permitId => permitId.equals(permit._id));
        if (exists) {
            return next(new CustomError("Permit already exists", 200));
        };
        await user.updateOne({ $push: { permits: permit._id } });

        return res.json({ status: true, msg: "Added permit to user successfully" });
    }
}



module.exports = {
    store,
    login,
    addRoleToUser,
    removeRoleFromUser,
    addPermitToUser
}