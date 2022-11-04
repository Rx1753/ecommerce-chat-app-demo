import pjs from '../package.json';
require('dotenv/config');

const { name, version } = pjs;

export = {
  name,
  version,
  //log: () => getLogger(name, version, 'debug'),
  // serviceRegistryUrl: `http://${process.env.SVC_REGISTRY_HOST}:${process.env.SVC_REGISTRY_PORT}`,
  // serviceVersionId: '1.0.0',
  db: {
    dsn: process.env.MONGO_URI,
  },
};
