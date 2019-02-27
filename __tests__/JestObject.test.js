// let citys = [];
// function initializeCityDatabase(callback) {
//   setTimeout(() => {
//     citys = ['Vienna', 'San Juan'];
//     callback();
//   }, 1000);
// }
// function clearCityDatabase() {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       citys = [];
//       resolve('clean successful');
//     }, 1000);
//   });
// }
// function isCity(city) {
//   return citys.includes(city);
// }

// beforeEach(done => {
//   initializeCityDatabase(() => {
//     done();
//   });
// });
// // afterEach(() => {
// //   return clearCityDatabase().then(data => console.log(data));
// // });
// afterEach(async () => {
//   const data = await clearCityDatabase();
//   console.log(data);
// });
// test('city database has Vienna', () => {
//   expect(isCity('Vienna')).toBeTruthy();
// });
// test('city database has San Juan', () => {
//   expect(isCity('San Juan')).toBeTruthy();
// });

// let citys = [];
// function initializeCityDatabase() {
//   citys = ['Vienna', 'San Juan'];
// }
// function clearCityDatabase() {
//   citys = [];
// }
// function isCity(city) {
//   return citys.includes(city);
// }

// beforeEach(() => {
//   console.log('beforeEach');
//   initializeCityDatabase();
// });
// afterEach(() => {
//   console.log('afterEach');
//   clearCityDatabase();
// });
// test('city database has Vienna', () => {
//   expect(isCity('Vienna')).toBeTruthy();
// });
// test('city database has San Juan', () => {
//   expect(isCity('San Juan')).toBeTruthy();
// });

let citys = [];
function initializeCityDatabase(callback) {
  setTimeout(() => {
    citys = ['Vienna', 'San Juan'];
    callback();
  }, 1000);
}
function clearCityDatabase() {
  return new Promise(resolve => {
    setTimeout(() => {
      citys = [];
      resolve('clean successful');
    }, 1000);
  });
}
function isCity(city) {
  return citys.includes(city);
}

beforeAll(done => {
  console.log('beforeAll');
  initializeCityDatabase(() => {
    done();
  });
});
// afterAll(() => {
//   return clearCityDatabase().then(data => console.log(data));
// });
afterAll(async () => {
  console.log('afterAll');
  const data = await clearCityDatabase();
  console.log(data);
});
test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy();
});
test('city database has San Juan', () => {
  expect(isCity('San Juan')).toBeTruthy();
});
