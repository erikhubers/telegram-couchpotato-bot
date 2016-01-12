var fs = require('fs-extra');
var logger = require(__dirname + '/../lib/logger');

var aclListFile = __dirname + '/../acl.json';
var aclListFileTemplate = aclListFile + '.template';

var acl;

try {
  logger.info('acl file found %s', aclListFile);
  acl = JSON.parse(fs.readFileSync(aclListFile, 'utf8'));
} catch (err) {
  if (err.name === 'SyntaxError') {
    throw new Error('Invalid acl file, please make sure the file is in JSON format.');
  }

  // config file not found
  if (err.code === 'ENOENT') {
    logger.warn('acl file not found, copying from template');
    fs.copySync(aclListFileTemplate, aclListFile);
    acl = JSON.parse(fs.readFileSync(aclListFile, 'utf8'));
  }
}

module.exports = acl;
