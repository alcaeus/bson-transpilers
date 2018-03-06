const antlr4 = require('antlr4');
const ECMAScriptLexer = require('./lib/ECMAScriptLexer.js');
const ECMAScriptParser = require('./lib/ECMAScriptParser.js');
const ECMAScriptTransformer = require('./transformers/ECMAScriptTransformer.js');
const PrintListener = require('./codegeneration/ECMAScriptListener.js');
// const ECMAScriptVisitor = require('./codegeneration/ECMAScriptVisitor.js');

/**
 * Compiles an ECMAScript string into... an ECMAScript string.
 *
 * @param {String} input
 * @returns {String}
 */
const compileECMAScript = function(input) {
  // Create parse tree
  const chars = new antlr4.InputStream(input);
  const lexer = new ECMAScriptLexer.ECMAScriptLexer(chars);
  const tokens = new antlr4.CommonTokenStream(lexer);
  const parser = new ECMAScriptParser.ECMAScriptParser(tokens);

  parser.buildParseTrees = true;

  const tree = parser.expressionSequence();
  const transformer = new ECMAScriptTransformer();

  // Generate AST

  // TODO: Maybe start somewhere other than program
  transformer.visitExpressionSequence(tree);

  // Print
  const listener = new PrintListener();
  const AST = listener.buildAST(tree, parser.ruleNames);


  console.log('AST----------------------');
  console.log(JSON.stringify(AST, null, 2));
  console.log('----------------------');

  // Generate code
  // const visitor = new ECMAScriptVisitor();
  // return visitor.visitProgram(tree);
};

const input = '{x: 1, y: 2}';

compileECMAScript(input);


