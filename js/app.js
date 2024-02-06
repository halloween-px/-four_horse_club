import Carousel from "./components/Carousel.js";

const App = {
    init() {
        this.plugins().carousel();
        this.plugins().ticker();
    },

    plugins() {
        const carousel = () => {
            const sliders = document.querySelectorAll('.carousel');
            sliders.forEach(slider => {
                new Carousel(slider).init();
            })
        }

        const ticker = () => {
            const tickers = document.querySelectorAll('[data-ticker]');

            if (tickers.length) {
                tickers.forEach(el => {
                    const text = el.children[0];
                    const cloneText = text.cloneNode(true);
                    el.append(cloneText);

                    const widthEl = Number(el.scrollWidth) / 2;
                    el.style.setProperty('--ticker-width', widthEl);
                })
            }
        }

        return {
            carousel,
            ticker
        }
    }
}

App.init();


// const timeoutedPromise = (promise, timeout) => {
//     return new Promise((resolve, reject) => {
//         const timeoutId = setTimeout(() => reject(new Error('timeout')), timeout);
//         promise
//             .then(res => resolve(res.json()))
//             .catch(reject)
//             .finally(() => clearTimeout(timeoutId))
//     })
// }
//
// const delay = (v, s) =>
//     new Promise(resolve => {
//         setTimeout(() => resolve(v), s)
//     });
//
// const test = async (fetch, time) => {
//     try {
//         await timeoutedPromise(fetch, time);
//     } catch (err) {
//         console.log(err.message)
//     }
// }

const counter = (() => {
    let count = 0;

    const increment = () => {
        count += 1;
    }

    const value = () => {
        return count;
    }

    return {
        increment,
        value,
    }
})();

counter.increment();
counter.increment();
console.log(counter.value());

