import code2 from './code2.ts';

const something = 'code.ts'
console.log(something);

interface Name {
    type: 'name',
    somedata: string,
}

const item: Name = {
    type: 'name',
    somedata: 'Hello'
}

console.log('My item from code.ts', item);

code2();