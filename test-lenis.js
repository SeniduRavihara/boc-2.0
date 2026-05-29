const Lenis = require('lenis').default || require('lenis');
const lenis = new Lenis();
console.log(Object.keys(lenis));
console.log('start' in lenis, typeof lenis.start);
console.log('resume' in lenis, typeof lenis.resume);
