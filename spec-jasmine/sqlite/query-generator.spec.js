var Sequelize      = require("../../index")
  , sequelize      = new Sequelize(null, null, null, { dialect: 'sqlite' })
  , Helpers        = new (require("../config/helpers"))(sequelize)
  , QueryGenerator = require("../../lib/dialects/sqlite/query-generator")
  , util           = require("util");

describe('QueryGenerator', function() {
  beforeEach(function() { Helpers.sync() })
  afterEach(function() { Helpers.drop() })

  var suites = {
    insertQuery: [
      {
        arguments: ['myTable', { name: 'foo' }],
        expectation: "INSERT INTO `myTable` (`name`) VALUES ('foo');"
      }, {
        arguments: ['myTable', { name: "'bar'" }],
        expectation: "INSERT INTO `myTable` (`name`) VALUES ('''bar''');"
      }, {
        arguments: ['myTable', { name: "bar", value: null }],
        expectation: "INSERT INTO `myTable` (`name`,`value`) VALUES ('bar',NULL);"
      }, {
        arguments: ['myTable', { name: "bar", value: undefined }],
        expectation: "INSERT INTO `myTable` (`name`,`value`) VALUES ('bar',NULL);"
      }, {
        arguments: ['myTable', { name: "foo", value: true }],
        expectation: "INSERT INTO `myTable` (`name`,`value`) VALUES ('foo',1);"
      }, {
        arguments: ['myTable', { name: "foo", value: false }],
        expectation: "INSERT INTO `myTable` (`name`,`value`) VALUES ('foo',0);"
      }
    ],

    updateQuery: [
      {
        arguments: ['myTable', { name: 'foo' }, { id: 2 }],
        expectation: "UPDATE `myTable` SET `name`='foo' WHERE `id`=2"
      }, {
        arguments: ['myTable', { name: "'bar'" }, { id: 2 }],
        expectation: "UPDATE `myTable` SET `name`='''bar''' WHERE `id`=2"
      }, {
        arguments: ['myTable', { name: 'bar', value: null }, { id: 2 }],
        expectation: "UPDATE `myTable` SET `name`='bar',`value`=NULL WHERE `id`=2"
      }, {
        arguments: ['myTable', { name: 'bar', value: undefined }, { id: 2 }],
        expectation: "UPDATE `myTable` SET `name`='bar',`value`=NULL WHERE `id`=2"
      }, {
        arguments: ['myTable', { flag: true }, { id: 2 }],
        expectation: "UPDATE `myTable` SET `flag`=1 WHERE `id`=2"
      }, {
        arguments: ['myTable', { flag: false }, { id: 2 }],
        expectation: "UPDATE `myTable` SET `flag`=0 WHERE `id`=2"
      }
    ]
  };

  Sequelize.Utils._.each(suites, function(tests, suiteTitle) {
    describe(suiteTitle, function() {
      tests.forEach(function(test) {
        var title = test.title || 'correctly returns ' + test.expectation + ' for ' + util.inspect(test.arguments)
        it(title, function() {
          var conditions = QueryGenerator[suiteTitle].apply(null, test.arguments)
          expect(conditions).toEqual(test.expectation)
        })
      })
    })
  })
});
