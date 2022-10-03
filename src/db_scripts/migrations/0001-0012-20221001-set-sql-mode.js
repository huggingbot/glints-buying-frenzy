"use strict";
exports.__esModule = true;
module.exports = {
    up: function (queryInterface) {
        return queryInterface.sequelize.query("SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));");
    },
    down: function () {
        return;
    }
};
