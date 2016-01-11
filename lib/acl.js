var fs = require('fs-extra');
var logger = require(__dirname + '/../lib/logger');

var aclListFile = __dirname + '/../acl.json';
var aclListFileTemplate = aclListFile + '.template';

var acl;

try {
  logger.info('acl file found %s', aclListFile);
  acl = require(aclListFile);
} catch (err) {
  logger.warn('acl file not found');
  fs.copySync(aclListFileTemplate, aclListFile);
  acl = require(aclListFile);
}

module.exports = acl;
