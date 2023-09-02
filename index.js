const LoadScriptRuntimeModule = require('./lib/LoadScriptRuntimeModule');

class CrxLoadScriptWebpackPlugin {
  /**
   * 
   * @param { {entry: RegExp} } options 
   */
  constructor(options){
    if(!(options.entry instanceof RegExp || options.entry.constructor === RegExp))throw Error("The entry option has to be a RegExp")
    this.options = options
  }
  apply(compiler) {
    compiler.hooks.compilation.tap(
      'CrxLoadScriptWebpackPlugin',
      (compilation) => {
        const { RuntimeGlobals } = compiler.webpack;
        compilation.hooks.runtimeRequirementInTree
          .for(RuntimeGlobals.loadScript)
          .tap('CrxLoadScriptWebpackPlugin', (chunk, set) => {
            if(this.options.entry.test(chunk.name)){
              compilation.addRuntimeModule(chunk, new LoadScriptRuntimeModule());
            }
            return true;
          });
      }
    );
  }
}

module.exports = CrxLoadScriptWebpackPlugin;
