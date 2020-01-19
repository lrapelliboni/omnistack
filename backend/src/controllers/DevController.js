const Dev = require('../models/Dev');
const api = require('../services/api');
const parseStringAsArray = require('../utils/parseStringAsArray');

// index,show, update, destroy
module.exports = {
    async index(req, res) {
        const devs = await Dev.find();
        return res.status(200).json(devs);
    },
    async store(req, res) {
        const { github_username, techs, longitude, latitude } = req.body;
        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            const apiResponse = await api.get(`/users/${github_username}`);
            const { name = login, avatar_url, bio } = apiResponse.data;
            const techsArray = parseStringAsArray(techs);
            
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            };

            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location: location,
            });
        }
        return res.status(201).json(dev);
    }
};
