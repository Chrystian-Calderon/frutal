class DistributorsController {
    constructor({ distributorsModel }) {
        this.distributorsModel = distributorsModel;
    }

    getName = async (req, res) => {
        try {
            const [rows] = await this.distributorsModel.getName();
            res.json(rows);
        } catch (e) {
            res.status(500).json({
                error: e.message
            });
        }
    }
}

module.exports = DistributorsController;