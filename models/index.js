const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/wikistack', {
    logging: false
});

let Page = db.define('page', {
    title: {
        type: Sequelize.STRING, allowNull: false
    },
    urlTitle: {
        type: Sequelize.STRING, allowNull: false
    },
    content: {
        type: Sequelize.TEXT, allowNull: false
    },
    status: {
        type: Sequelize.ENUM('open', 'closed'), defaultValue: 'open'
    },
    date: {
        type: Sequelize.DATE, defaultValue: Sequelize.NOW
    }
}, {
    getterMethods: {
        route: function() { return '/wiki/' + this.urlTitle }
    },
    hooks: {
        // title is already provided but need to create a urlTitle and set it to the 'page' instance
        beforeValidate: function(page) {
            if (page.title) {
                // Replaces withspace with underscore; then removes non-alphanumeric characters from title
                page.urlTitle = page.title.replace(/\s+/g, '_').replace(/\W/g, '');
            } else {
                // Generates random 5 letter string
                page.urlTitle = Math.random().toString(36).substring(2, 7);
            }          
        }
    }    
});

let User = db.define('user', {
    name: {
        type: Sequelize.STRING, allowNull: false
    },
    email: {
        type: Sequelize.STRING, allowNull: false, unique: true, validate: { isEmail: true }
    }
});

Page.belongsTo(User, {as: 'author'}); // User's PK as FK on Page (pages table), specifically: authorId

module.exports = {
  Page: Page,
  User: User,
  db: db
};