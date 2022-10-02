"use strict";
exports.__esModule = true;
module.exports = {
    up: function (queryInterface) {
        return queryInterface.sequelize.query("ALTER DATABASE ".concat(queryInterface.sequelize.config.database, "\n        CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"));
    },
    down: function () {
        return;
    }
};
