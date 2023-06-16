const TagModel = require('../models/tag');
const helper = require('../utils/helper');
const path = require('path');
const fs = require('fs');
const rootDir = path.resolve(__dirname, '..');

const add = async (req, res, next) => {
    const name = req.body.name;
    const image = req.imageName;

    let tag = await TagModel.findOne({ name });
    if (tag) {
        return res.json({ status: false, msg: "Tag already exists" })
    }

    await new TagModel({ name, image }).save();

    res.status(200).json({ status: true, msg: 'Tag created successfully' });
}

const all = async (req, res, next) => {
    try {
        const tags = await TagModel.find();
        const tagsWithImageUrl = tags.map((tag) => {
            return {
                _id: tag._id,
                name: tag.name,
                imageUrl: helper.generateTagImageUrl(req, tag.image)
            };
        });
        res.status(200).json({ status: true, data: tagsWithImageUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Failed to fetch tags' });
    }
}

const get = async (req, res) => {
    try {
        const tag = await TagModel.findById(req.params.id);
        if (!tag) {
            return res.status(200).json({ status: false, msg: "Tag not found" });
        }
        tag.image = helper.generateTagImageUrl(req, tag.image);
        res.status(200).json({ status: true, data: tag });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Failed to fetcf tag' });
    }
}

const deleteTag = async (req, res) => {
    try {
        const tag = await TagModel.findById(req.params.id);
        if (!tag) {
            return res.status(200).json({ status: false, msg: "Tag not found" });
        }
        let image = tag.image;
        const imagePath = path.join(rootDir, '/uploads/tag', image);
        fs.unlinkSync(imagePath);

        await TagModel.findByIdAndDelete(tag._id);

        return res.status(200).json({ status: true, msg: "Deleted tag successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: 'Failed to delete tag' });
    }
}

const update = async (req, res) => {
    let id = req.params.id;
    let tag = await TagModel.findById(id);
    if (tag) {
        let name = req.body.name;
        let image = req.imageName ? req.imageName : null;
        let data = image ? { name, image } : { name };
        await TagModel.findByIdAndUpdate(id, data);
        if (image) {
            const imagePath = path.join(rootDir, '/uploads/tag', tag.image);
            fs.unlinkSync(imagePath);
        }
        res.json({ status: true, msg: 'Update Tag successfully' });
    } else {
        return res.json({ status: false, msg: "Tag not found" })
    }
}
module.exports = {
    add,
    all,
    get,
    deleteTag,
    update
}