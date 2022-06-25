import convict from 'convict';
import toml from 'toml';

convict.addParser({ extension: 'toml', parse: toml.parse });
convict.addFormat({
  name: 'custom-boolean',
  validate: (val) => {
    if (val !== true && val !== false) {
      throw new Error('Must be Boolean (true/false)');
    }
  },
});

const config = convict({
  configPath: {
    doc: 'Path to external config file',
    default: './config/default.toml',
    env: 'NODE_CONFIG_DIR',
  },
  port: {
    doc: `Server port to use`,
    format: 'port',
    default: 3000,
    env: 'PORT',
  },
  host: {
    doc: `Hostname`,
    default: 'localhost',
    env: 'HOST',
  },
  sslCert: {
    doc: `Path to ssl certificate`,
    env: 'CBRN_SSL_CERT',
  },
  sslKey: {
    doc: `Path to ssl certificate key`,
    env: 'CBRN_SSL_KEY',
  },
  mongo: {
    doc: `connection url to mongodb (server:port)`,
    default: 'localhost:27017',
    env: 'CBRN_MONGO',
  },
  logging: {
    logLevelConsole: {
      doc: `Log level for console output`,
      default: 'info',
      format: ['error', 'warn', 'info', 'verbose', 'debug', 'silly'],
      env: 'CBRN_LOG_LEVEL',
    },
    enableTimingLog: {
      doc: `Enables timing log for requests`,
      default: true,
      env: 'CBRN_TIME_LOG',
    },
  },
});

// Load config from file & validate against schema
try {
  config.loadFile(`${config.get('configPath')}`).validate();
} catch (e) {
  // ignore
}

export default config;
