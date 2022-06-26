const LoadScriptRuntimeModule = require('./lib/LoadScriptRuntimeModule');

class CrxLoadScriptWebpackPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap(
      'CrxLoadScriptWebpackPlugin',
      (compilation) => {
        const { RuntimeGlobals } = compiler.webpack;
        compilation.hooks.runtimeRequirementInTree
          .for(RuntimeGlobals.loadScript)
          .tap('CrxLoadScriptWebpackPlugin', (chunk, set) => {
            compilation.addRuntimeModule(chunk, new LoadScriptRuntimeModule());
            return true;
          });
      }
    );
  }
}

module.exports = CrxLoadScriptWebpackPlugin;
