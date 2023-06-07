const fs = require('fs');
const UserModel = require('../models/user');

const backUpUser = async () => {
    const users = await UserModel.find();
    const jsonData = JSON.stringify(users, null, 2);
    try {
    fs.writeFile('./backups/user.json', jsonData, (err) => {
        if (err) {
          console.error('Error writing backup file:', err);
        //   res.status(500).send('Error writing backup file');
        } else {
          console.log('Backup file created successfully');
        //   res.status(200).send('Backup file created successfully');
        }
      });
    } catch (error) {
      console.error('Error retrieving user data:', error);
    //   res.status(500).send('Error retrieving user data');
    }
}

module.exports = {
    backUpUser
}