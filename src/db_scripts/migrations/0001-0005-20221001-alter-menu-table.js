"use strict";
exports.__esModule = true;
var TABLE_NAME = 'menu';
module.exports = {
    up: function (queryInterface) {
        return queryInterface.sequelize.query("ALTER TABLE ".concat(TABLE_NAME, " ADD FULLTEXT(dishName);"));
    },
    down: function () {
        return;
    }
};
