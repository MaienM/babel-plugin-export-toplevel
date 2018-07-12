const babel = require('babel-core');
const plugin = require('./index');

const normalize = (input) => input.replace(/;/g, '').replace(/\s+/g, ' ');

const run = (input) => {
	const normalInput = normalize(input);
	const { code } = babel.transform(normalInput, { plugins: [plugin] });
	const normalCode = normalize(code);
	expect(normalCode.startsWith(normalInput)).toBe(true);
	return normalCode.replace(normalInput, '').trim();
};

test('top-level const should be exported', () => {
	const result = run('const foo = 1');
	expect(result).toEqual('export { foo }');
});

test('top-level let should be exported', () => {
	const result = run('let foo = 1');
	expect(result).toEqual('export { foo }');
});

test('top-level var should be exported', () => {
	const result = run('var foo = 1');
	expect(result).toEqual('export { foo }');
});

test('top-level object deconstruct should be exported', () => {
	const result = run('const { foo, bar } = {}');
	expect(result).toEqual('export { foo, bar }');
});

test('top-level array spread should be exported', () => {
	const result = run('const [foo, bar] = []');
	expect(result).toEqual('export { foo, bar }');
});

test('top-level arrow functions should be exported', () => {
	const result = run('const foo = () => null');
	expect(result).toEqual('export { foo }');
});

test('top-level functions should be exported', () => {
	const result = run('function foo() {}');
	expect(result).toEqual('export { foo }');
});

// test('top-level anonymous function expressions should be exported', () => {
// 	const result = run('const foo = function() {}');
// 	expect(result).toEqual('export { foo }');
// });

test('top-level named function expressions should be exported as both names', () => {
	const result = run('const foo = function bar() {}');
	expect(result).toEqual('export { foo, bar }');
});

test('top-level classes should be exported', () => {
	const result = run('class Foo {}');
	expect(result).toEqual('export { Foo }');
});

// test('top-level anonymous class expressions should be exported', () => {
// 	const result = run('const Foo = class() {}');
// 	expect(result).toEqual('export { Foo }');
// });

// test('top-level named class expressions should be exported as both names', () => {
// 	const result = run('const Foo = class Bar() {}');
// 	expect(result).toEqual('export { Foo, Bar }');
// });

test('non top-level const should not be exported', () => {
	const result = run('(() => { const foo = 1 })()');
	expect(result).toEqual('');
});

test('already exported top-level constant should not be re-exported', () => {
	const result = run('export const foo = 1');
	expect(result).toEqual('');
});

test('an import should not be re-exported', () => {
	const result = run('import foo, { bar, baz } from "module"');
	expect(result).toEqual('');
});
