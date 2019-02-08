const rxjs = require('rxjs');

var obj1 = {
   work: 'coding',
  feeling: 'fun',
   thisYear: 'successful'
};

var stuff = ['cat', 'dog'];
spreadOps=( obj1, stuff) => {
  return { ...obj1,stuff};
}

console.log(spreadOps(obj1, stuff));

console.log('foo');

setTimeout( ()=>console.log('bar'),1000);

console.log('war');

console.log('*****map play basic 1******');
var arr = ['2019','going','to','be','great!'];
var mapped = arr.map( x=>x+'Star');

console.log('*****filter play basic 1******');
var filtered = arr.filter( x=> x=='great!');
console.log(filtered);

console.log('*****reducer play basic ******');
var nums = [1,2,3,4]
const reducerCallBack = (accumulator, currVal) => accumulator * currVal;
var reduced = nums.reduce(reducerCallBack);
console.log(reduced);

console.log('***** pipe and map combo ******');
const source = rxjs.from([
  { name: 'Joe', age: 30 },
  { name: 'Frank', age:20 },
  { name: 'Ryan', age: 50 }
]);

