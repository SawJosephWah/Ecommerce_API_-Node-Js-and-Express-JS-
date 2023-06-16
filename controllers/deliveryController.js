const DeliveryModel = require('../models/delivery');
const helper = require('../utils/helper');
const path = require('path');
const fs = require('fs');
const rootDir = path.resolve(__dirname, '..');

const add = async (req, res, next) => {
    const name = req.body.name;
    const image = req.imageName;
    const price = req.body.price;
    const duration = req.body.duration;
    const remarks = req.body.remarks;

    let delivery = await DeliveryModel.findOne({ name });
    if (delivery) {
        return res.json({ status: false, msg: "Delivery already exists" })
    }

    await new DeliveryModel({ name, image, price, duration, remarks }).save();

    res.status(200).json({ status: true, msg: 'Delivery created successfully' });
}

const all = async (req, res, next) => {
    try {
        const deliveries = await DeliveryModel.find();
        const deliveriesWithImageUrl = deliveries.map((delivery) => {
            return {
                _id: delivery._id,
                name: delivery.name,
                price: delivery.price,
                remarks: delivery.remarks,
                duration: delivery.duration,
                imageUrl: helper.generateDeliveryImageUrl(req, delivery.image)
            };
        });
        res.status(200).json({ status: true, data: deliveriesWithImageUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Failed to fetch delivery datas' });
    }
}

const get = async (req, res) => {
    try {
        const delivery = await DeliveryModel.findById(req.params.id);
        if (!delivery) {
            return res.status(200).json({ status: false, msg: "Delivery not found" });
        }
        delivery.image = helper.generateDeliveryImageUrl(req, delivery.image);
        res.status(200).json({ status: true, data: delivery });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Failed to fetch delivery' });
    }
}

const deleteDelivery = async (req, res) => {
    try {
        const delivery = await DeliveryModel.findById(req.params.id);
        if (!delivery) {
            return res.status(200).json({ status: false, msg: "Delivery not found" });
        }
        let image = delivery.image;
        const imagePath = path.join(rootDir, '/uploads/delivery', image);
        fs.unlinkSync(imagePath);

        await DeliveryModel.findByIdAndDelete(delivery._id);

        return res.status(200).json({ status: true, msg: "Deleted delivery successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: 'Failed to delete delivery tag' });
    }
}

const update = async (req, res) => {
    let id = req.params.id;
    let delivery = await DeliveryModel.findById(id);
    if (delivery) {
        let data = {};
        data = req.body.name ? { ...data, name: req.body.name } : data;
        data = req.body.price ? { ...data, price: req.body.price } : data;
        data = req.body.duration ? { ...data, duration: req.body.duration } : data;
        data = req.body.remarks ? { ...data, remarks: req.body.remarks } : data;
        let image = req.imageName ? req.imageName : null;
        data = image ? { ...data, image } : data;
        await DeliveryModel.findByIdAndUpdate(id, data);
        if (image) {
            const imagePath = path.join(rootDir, '/uploads/delivery', delivery.image);
            fs.unlinkSync(imagePath);
        }
        res.json({ status: true, msg: 'Update delivery successfully' });
    } else {
        return res.json({ status: false, msg: "Delivery not found" })
    }
}
module.exports = {
    add,
    all,
    get,
    deleteDelivery,
    update
}