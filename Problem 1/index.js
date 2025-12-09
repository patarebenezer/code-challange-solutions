let sum_to_n_a = function (n) {
 let sum = 0;

 if (n >= 1) {
  for (let i = 1; i <= n; i++) sum += i;
 } else {
  for (let i = n; i <= -1; i++) sum += i;
 }

 return sum;
};

let sum_to_n_b = function (n) {
 if (n === 0) return 0;

 const m = Math.abs(n);
 const tri = (m * (m + 1)) / 2;

 return n > 0 ? tri : -tri;
};

let sum_to_n_c = function (n) {
 if (n === 0) return 0;

 const start = n > 0 ? 1 : n;
 const end = n > 0 ? n : -1;
 const len = end - start + 1;

 return Array.from({ length: len }, (_, idx) => start + idx)
  .reduce((acc, v) => acc + v, 0);
};

console.log(sum_to_n_a(5), sum_to_n_b(5), sum_to_n_c(5));   // 15 15 15
console.log(sum_to_n_a(1), sum_to_n_b(1), sum_to_n_c(1));   // 1 1 1
console.log(sum_to_n_a(0), sum_to_n_b(0), sum_to_n_c(0));   // 0 0 0
console.log(sum_to_n_a(-3), sum_to_n_b(-3), sum_to_n_c(-3)); // -6 -6 -6