// function forEach(items, callback) {
//   for (let index = 0; index < items.length; index++) {
//     callback(items[index]);
//   }
// }

// test('JestMock', () => {
//   const mockCallback = jest.fn(x => 42 + x);
//   forEach([0, 1], mockCallback);

//   console.log('mockCallback', mockCallback.mock);

//   // The mock function is called twice
//   expect(mockCallback.mock.calls.length).toBe(2);

//   // The first argument of the first call to the function was 0
//   expect(mockCallback.mock.calls[0][0]).toBe(0);

//   // The first argument of the second call to the function was 1
//   expect(mockCallback.mock.calls[1][0]).toBe(1);

//   // The return value of the first call to the function was 42
//   expect(mockCallback.mock.results[0].value).toBe(42);
// });

// test('JestMock', () => {
//   const myMock = jest.fn();
//   console.log(myMock());
//   // > undefined

//   myMock
//     .mockReturnValueOnce(10)
//     .mockReturnValueOnce('x')
//     .mockReturnValue(true);

//   console.log(myMock(), myMock(), myMock(), myMock());
// });

// test('jest.fn()简单使用', () => {
//   let mock = jest.fn();
//   let result = mock(1, 2, 3);
//   // 断言mock的执行后返回undefined
//   expect(result).toBeUndefined();
//   // 断言mock被调用
//   expect(mock).toBeCalled();
//   // 断言mock被调用了一次
//   expect(mock).toBeCalledTimes(1);
//   // 断言mock传入的参数为1, 2, 3
//   expect(mock).toHaveBeenCalledWith(1, 2, 3);
// });

// function fetchData(callback = () => {}) {
//   return new Promise(resolve => {
//     setTimeout(() => callback() && resolve(), 3000);
//   });
// }
// test('测试fetchData是否被调用', () => {
//   const mock = jest.fn();
//   fetchData(mock).then(() => {
//     expect(mock).toBeCalled();
//   });
// });

// test('JestMock', () => {
//   const myMockFn = jest.fn(cb => cb(null, true));

//   myMockFn((err, val) => console.log(val));
//   // > true
// });

test('JestMock', () => {
  const myMockFn = jest
    .fn()
    .mockImplementationOnce(cb => cb(null, true))
    .mockImplementationOnce(cb => cb(null, false));

  myMockFn((err, val) => console.log(val));
  // > true

  myMockFn((err, val) => console.log(val));
  // > false
});
