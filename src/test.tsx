const number1 = "1";
const number2 = 2;

let number = "a";

number = 1;

console.log(add(number1, number2));

const person: {
  name: string;
  hobbys: (string | number)[];
} = {
  name: "Walter",
  hobbys: ["li", "la", 2],
};

console.log(person.hobbys[1]);

export function add(a: number, b: number) {
  return a + b;
}

export function log(input: string) {
  console.log(input);
}

console.log(add(1, 2));
