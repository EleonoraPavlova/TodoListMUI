// 1. Функция sum принимает параметром целые положительные
// числа (неопределённое кол-во) и возвращает их сумму (rest).

export function sum(...nums: Array<number>): number {
  return [...nums].reduce((acc, curr) => acc + curr)
}


// 2. Функция getTriangleType принимает три параметра:
// длины сторон треугольника.
// Функция должна возвращать:
//  - "10", если треугольник равносторонний,
//  - "01", если треугольник равнобедренный,
//  - "11", если треугольник обычный,
//  - "00", если такого треугольника не существует.

export function getTriangleType(a: number, b: number, c: number): string {
  if (a + b > c && b + c > a && a + c > b) {
    if (a === b && b === c) {
      return "10"
    } else if (a === b || b === c || c === a) {
      return "01"
    } else {
      return "11"
    }
  } else {
    return "00"
  }

}


// 3. Функция getSum принимает параметром целое число и возвращает
// сумму цифр этого числа
export function getSum(number: number): number {
  return number.toString().split("").reduce((acc, curr) => acc + Number(curr), 0)
}


// 4. Функция isEvenIndexSumGreater принимает  параметром массив чисел.
// Если сумма чисел с чётными ИНДЕКСАМИ!!! (0 как чётный индекс) больше
// суммы чисел с нечётными ИНДЕКСАМИ!!!, то функция возвращает true.
// В противном случае - false.

export const isEvenIndexSumGreater = (arr: Array<number>): boolean => {
  let evenArr = arr.filter((_, index) => index % 2 === 0).reduce((acc, curr) => acc + curr)
  let odd = arr.filter((_, index) => index % 2 !== 0).reduce((acc, curr) => acc + curr)
  return evenArr > odd
}

// 5. Функция getSquarePositiveIntegers принимает параметром массив чисел и возвращает новый массив. 
// Новый массив состоит из квадратов целых положительных чисел, котрые являются элементами исходгого массива.
// Исходный массив не мутирует.
export function getSquarePositiveIntegers(array: Array<number>): Array<number> {
  return array.filter(n => n > 0 && n % 1 === 0).map(n => Math.pow(n, 2))
}

// 6. Функция принимает параметром целое не отрицательное число N и возвращает сумму всех чисел от 0 до N включительно
// Попробуйте реализовать функцию без использования перебирающих методов.

export function sumFirstNumbers(N: number): number {
  let arr = []
  for (let i = 0; i <= N; i++) {
    arr.push(i);
  }
  return arr.reduce((acc, curr) => acc + curr)
}



// Д.З.:
// 7. Функция-банкомат принимает параметром целое натуральное число (сумму).
// Возвращает массив с наименьшим количеством купюр, которыми можно выдать эту
// сумму. Доступны банкноты следующих номиналов:
// const banknotes = [1000, 500, 100, 50, 20, 10, 5, 2, 1].
// Считаем, что количество банкнот каждого номинала не ограничено

export function getBanknoteList(amountOfMoney: number): Array<number> {
  const banknotes = [1000, 500, 100, 50, 20, 10, 5, 2, 1];
  const result = [];

  for (const b of banknotes) {
    while (amountOfMoney >= b) {
      result.push(b);
      amountOfMoney -= b;
    }
  }
  return result;
}