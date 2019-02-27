// function fetchData(callback = () => {}) {
//   setTimeout(() => callback('peanut butter'), 3000);
// }

// test('the data is peanut butter', done => {
//   function callback(data) {
//     console.log('data', data);
//     expect(data).toBe('peanut butter');
//     done();
//   }
//   fetchData(callback);
//   console.log('sfsdf');
// });

// test('the data is peanut butter', () => {
//   function callback(data) {
//     expect(data).toBe('peanut butter');
//   }
//   fetchData(callback);
// });

// function fetchData() {
//   return new Promise(resolve => {
//     setTimeout(() => resolve('peanut butter'), 3000);
//   });
// }
//
// test('the data is peanut butter', () => {
//   return fetchData().then(data => {
//     expect(data).toBe('peanut butter');
//   });
// });

// function fetchData() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => reject('error'), 3000);
//   });
// }
// test('the fetch fails with an error', () => {
//   expect.assertions(1); // 保证至少被调用一次
//   return fetchData().catch(e => {
//     expect(e).toMatch('error');
//   });
// });

// function fetchData() {
//   return new Promise(resolve => {
//     setTimeout(() => resolve('peanut butter'), 3000);
//   });
// }

// test('the data is peanut butter', () => {
//   return expect(fetchData()).resolves.toBe('peanut butter');
// });

// function fetchData() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => reject('error'), 3000);
//   });
// }
// test('the fetch fails with an error', () => {
//   return expect(fetchData()).rejects.toMatch('error');
// });

// function fetchData() {
//   return new Promise(resolve => {
//     setTimeout(() => resolve('peanut butter'), 3000);
//   });
// }
// test('the data is peanut butter', async () => {
//   expect.assertions(1);
//   const data = await fetchData();
//   expect(data).toBe('peanut butter');
// });

// test('the data is peanut butter', async () => {
//   await expect(fetchData()).resolves.toBe('peanut butter');
// });

function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject('error'), 3000);
  });
}
test('the data is peanut butter', async () => {
  expect.assertions(1);
  try {
    await fetchData();
  } catch (error) {
    expect(error).toMatch('error');
  }
});

test('the data is peanut butter', async () => {
  await expect(fetchData()).rejects.toMatch('error');
});
