import {from} from 'rxjs';
import {map} from 'rxjs/operators';

const obj1 = {
   work: 'coding',
  feeling: 'fun',
   thisYear: 'successful'
};

const stuff = ['cat', 'dog'];

function spreadOps( obj1: any, stuff: any) {
  return { ...obj1, stuff};
}

console.log(spreadOps(obj1, stuff));

console.log('foo');

setTimeout( () => console.log('bar'), 1000);

console.log('war');

console.log('*****map play basic 1******');
let arr = ['2019','going','to','be','great!'];
let mapped = arr.map( x=>x+'Star');

console.log('*****filter play basic 1******');
let filtered = arr.filter( x=> x=='great!');
console.log(filtered);

console.log('*****reducer play basic ******');
let nums = [1,2,3,4]
const reducerCallBack = (accumulator, currVal) => accumulator * currVal;
let reduced = nums.reduce(reducerCallBack);
console.log(reduced);

console.log('***** pipe and map combo ******');
const source = from([
  { name: 'Joe', age: 30 },
  { name: 'Frank', age: 20 },
  { name: 'Ryan', age: 50 }
]);

const piped = source.pipe( map( ( {age} ) => 'User age:' + age));
console.log(piped);
