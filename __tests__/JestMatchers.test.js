// test('one plus one is two', () => {
//   expect(2 + 2).toBe(4);
// });

// test('object assignment', () => {
//   const data = { one: 1 };
//   data['two'] = 2;
//   expect(data).toEqual({ one: 1, two: 2 });
// });

// test('two minux one is not two', () => {
//   expect(2 - 1).not.toBe(2);
// });

// test('null', () => {
//   const n = null;
//   expect(n).toBeNull();
//   expect(n).toBeDefined();
//   expect(n).not.toBeUndefined();
//   expect(n).not.toBeTruthy();
//   expect(n).toBeFalsy();
// });

// test('zero', () => {
//   const z = 0;
//   expect(z).not.toBeNull();
//   expect(z).toBeDefined();
//   expect(z).not.toBeUndefined();
//   expect(z).not.toBeTruthy();
//   expect(z).toBeFalsy();
// });

// test('two plus two', () => {
//   const value = 2 + 2;
//   expect(value).toBeGreaterThan(3);
//   expect(value).toBeGreaterThanOrEqual(3.5);
//   expect(value).toBeLessThan(5);
//   expect(value).toBeLessThanOrEqual(4.5);

//   expect(value).toBe(4);
//   expect(value).toEqual(4);
// });

// test('两个浮点数字相加', () => {
//   const value = 0.1 + 0.2;
//   // expect(value).toBe(0.3);
//   expect(value).toBeCloseTo(0.3);
// });

// test('there is not I in team', () => {
//   expect('team').not.toMatch(/I/);
// });

// test('but there is a "stop" in Christoph', () => {
//   expect('Christoph').toMatch(/stop/);
// });

// test('shopping list has beer', () => {
//   const shoppingList = ['diapers', 'kleenex', 'trash bags', 'paper towels', 'beer'];
//   expect(shoppingList).toContain('beer');
// });

class ConfigError extends Error {}

function compileAndroidCode() {
  throw new ConfigError('you are using the wrong JDK');
}
test('compiling android goes as expected', () => {
  expect(compileAndroidCode).toThrow();
  expect(compileAndroidCode).toThrow(ConfigError);

  // You can also use the exact error message or a regexp
  expect(compileAndroidCode).toThrow('you are using the wrong JDK');
  expect(compileAndroidCode).toThrow(/JDK/);
});
