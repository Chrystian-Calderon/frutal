const express = require('express');

const ProfileController = require('./../controller/profile.controller');

const createProfileController = ({ profileModel }) => {
    const router = express.Router();

    const profile = new ProfileController({ profileModel });

    router.get('/', profile.getProfiles);
    
    return router;
}

module.exports = createProfileController;