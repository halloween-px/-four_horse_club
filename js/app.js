import Carousel from "./components/Carousel.js";

const App = {
    init() {
        this.plugins().carousel();
    },

    plugins() {
        const carousel = () => {
            const sliders = document.querySelectorAll('.carousel');
            sliders.forEach(slider => {
                new Carousel(slider).init();
            })
        }

        return {
            carousel
        }
    }
}

App.init();