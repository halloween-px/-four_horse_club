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

