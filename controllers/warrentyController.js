const WarrentyModel = require('../models/warrenty');
const helper = require('../utils/helper');
const path = require('path');
const fs = require('fs');
const rootDir = path.resolve(__dirname, '..');

const add = async (req, res, next) => {
    const name = req.body.name;
    const image = req.imageName;
    const remarks = req.body.remarks;

    let warrenty = await WarrentyModel.findOne({ name });
    if (warrenty) {
        return res.json({ status: false, msg: "Warrenty already exists" })
    }

    await new WarrentyModel({ name, image, remarks }).save();

    res.status(200).json({ status: true, msg: 'Warrenty created successfully' });
}

const all = async (req, res, next) => {
    try {
        const warrenties = await WarrentyModel.find();
        const warrentiesWithImageUrl = warrenties.map((warrenty) => {
            return {
                _id: warrenty._id,
                name: warrenty.name,
                remarks: warrenty.remarks,
                imageUrl: helper.generateWarrentyImageUrl(req, warrenty.image)
            };
        });
        res.status(200).json({ status: true, data: warrentiesWithImageUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Failed to fetch warrenties datas' });
    }
}

const get = async (req, res) => {
    try {
        const warrenty = await WarrentyModel.findById(req.params.id);
        if (!warrenty) {
            return res.status(200).json({ status: false, msg: "Warrenty not found" });
        }
        warrenty.image = helper.generateWarrentyImageUrl(req, warrenty.image);
        res.status(200).json({ status: true, data: warrenty });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Failed to fetch warrenty' });
    }
}

const deleteWarrenty = async (req, res) => {
    try {
        const warrenty = await WarrentyModel.findById(req.params.id);
        if (!warrenty) {
            return res.status(200).json({ status: false, msg: "Warrenty not found" });
        }
        let image = warrenty.image;
        const imagePath = path.join(rootDir, '/uploads/warrenty', image);
        fs.unlinkSync(imagePath);

        await WarrentyModel.findByIdAndDelete(warrenty._id);

        return res.status(200).json({ status: true, msg: "Deleted warrenty successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: 'Failed to delete warrenty' });
    }
}

const update = async (req, res) => {
    let id = req.params.id;
    let warrenty = await WarrentyModel.findById(id);
    if (warrenty) {
        let data = {};
        data = req.body.name ? { ...data, name: req.body.name } : data;
        data = req.body.remarks ? { ...data, remarks: req.body.remarks } : data;
        let image = req.imageName ? req.imageName : null;
        data = image ? { ...data, image } : data;
        await WarrentyModel.findByIdAndUpdate(id, data);
        if (image) {
            const imagePath = path.join(rootDir, '/uploads/warrenty', warrenty.image);
            fs.unlinkSync(imagePath);
        }
        res.json({ status: true, msg: 'Update warrenty successfully' });
    } else {
        return res.json({ status: false, msg: "Warrenty not found" })
    }
}
module.exports = {
    add,
    all,
    get,
    deleteWarrenty,
    update
}