const tsConfigPaths = require('tsconfig-paths');
const tsConfig = require('./tsconfig.json');

// Registra os path aliases do tsconfig.json
tsConfigPaths.register({
  baseUrl: tsConfig.compilerOptions.baseUrl,
  paths: tsConfig.compilerOptions.paths,
});
