'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Categories',
            [{
              category: '家居物業',
              icon: 'fa-home',
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              category: '交通出行',
              icon: 'fa-shuttle-van',
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              category: '休閒娛樂',
              icon: 'fa-grin-beam',
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              category: '餐飲食品',
              icon: 'fa-utensils',
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              category: '其他',
              icon: 'fa-info',
              createdAt: new Date(),
              updatedAt: new Date()
            }]
          ,
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {})
  }
};
