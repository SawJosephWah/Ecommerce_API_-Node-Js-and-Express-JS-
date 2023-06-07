const fs = require('fs');
const UserModel = require('../models/user');
const RoleModel = require('../models/role');
const PermitModel = require('../models/permit');
const helper = require('../utils/helper');

const userSeeder = () => {
    fs.readFile('./migrations/user.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            return;
        }

        try {
            const usersData = JSON.parse(data);
            const promises = usersData.map(async userData => {
                let { name, email, phone, password } = userData;
                password = await helper.generatePasswordHash(password);
                const user = new UserModel({ name, email, phone, password });
                return user.save();
            });

            Promise.all(promises)
                .then(() => {
                    console.log('Users created successfully');
                })
                .catch((error) => {
                    console.error('Error creating users:', error);
                });
        } catch (error) {
            console.error('Error parsing data file:', error);
        }
    });
}

const roleAndPermissionSeeder = async () => {
    const jsonContent = fs.readFileSync("./migrations/role_and_permission.json", "utf8");
    const data = JSON.parse(jsonContent);
    await RoleModel.insertMany(data.roles);
    await PermitModel.insertMany(data.permits);
}

module.exports = {
    userSeeder,
    roleAndPermissionSeeder
}