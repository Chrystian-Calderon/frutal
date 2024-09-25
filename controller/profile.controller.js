class ProfileController {
    constructor({ profileModel }) {
        this.profileModel = profileModel;
    }

    getProfiles = async (req, res) => {
        try {
            const rows = await this.profileModel.getAll();
            res.json(rows);
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }
}

module.exports = ProfileController;