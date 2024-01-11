import { expect, test } from 'vitest'
import { printResult, run } from './interpreter.ts';
import { Right } from 'purify-ts';
import { newEnvironment } from './environment.ts';
import { WanderResult, WanderValue } from './values.ts';

const env = newEnvironment();

function evalAndCheck(script: string, expected: WanderValue) {
	const result = run(script, env);
	expect(result).toEqual(Right([expected, env]));	
}

test("print Int", () => {
	expect(printResult(Right([{type: "Int", value: 4n}, newEnvironment()]))).toEqual("4")
})

test("print empty Array", () => {
	expect(printResult(Right([{type: "Array", value: []}, newEnvironment()]))).toEqual("[]")
})

test("print empty Module", () => {
	expect(printResult(Right([{type: "Module", value: new Map()}, newEnvironment()]))).toEqual("{}")
})

test('eval Int', () => {
	evalAndCheck("45", { value: 45n, type: "Int" });
});

test('eval String', () => {
	evalAndCheck(`"Hello, World!"`, { value: "Hello, World!", type: "String"});
});

test("eval Bool", () => {
	evalAndCheck(`true`, { value: true, type: "Bool"});
});

test('eval Int as expression', () => {
	evalAndCheck("45,", { value: 45n, type: "Int" });
});

test('eval String as expression', () => {
	evalAndCheck(`"Hello, World!",`, { value: "Hello, World!", type: "String"});
});

test("eval Bool as expression", () => {
	evalAndCheck(`true,`, { value: true, type: "Bool"});
});

test("eval script of literals", () => {
	evalAndCheck(`true, 5, "hello"`, { value: "hello", type: "String"});
});

test("eval empty Array", () => {
	evalAndCheck(`[]`, { value: [], type: "Array"});
});

test("eval Array with 1 value", () => {
	evalAndCheck(`[1]`, { value: [{type: "Int", value: 1n}], type: "Array"});
});

test("eval Array", () => {
	evalAndCheck(`[true, 4]`, { value: [{type: "Bool", value: true}, {type: "Int", value: 4n}], type: "Array"});
});

test("eval empty Module", () => {
	evalAndCheck("{}", { value: new Map(), type: "Module"});
});

test("eval Module with one field", () => {
	evalAndCheck(`{hello = "world"}`, { value: new Map([["hello", {type: "String", "value": "world"}]]), type: "Module"});
});

test("eval Module with multiple fields", () => {
	evalAndCheck(`{hello = "world", x = 5, y = 6}`, { value: new Map([
		["hello", {type: "String", "value": "world"}],
		["x", {type: "Int", "value": 5n}],
		["y", {type: "Int", "value": 6n}],
	]), type: "Module"});
});

test("eval binding", () => {
	evalAndCheck("x = 5", {
		type: "Int", value: 5n
	})
})