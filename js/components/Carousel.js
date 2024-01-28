class Carousel {
    constructor(slider, params) {
        this.slider = slider;
        this.sliderWrpper = slider.querySelector('.carousel-wrapper');
        this.widthSlideWrapper = this.sliderWrpper.clientWidth;
        this.countSlide = this.sliderWrpper?.children.length;
        this.transform = 0;
        this.interval = null;
        this.timeout = null;
        this.params = {
            items: Number(this.slider?.getAttribute('data-items')) || 3,
            margin: Number(this.slider?.getAttribute('data-margin')) || 20,
            autoplay: this.slider?.getAttribute('data-autoplay') || false,
            autoplayDelay: this.slider?.getAttribute('data-autoplay-delay') || 4000,
            pagination: this.slider?.getAttribute('data-pagination') || false,
            navigation: this.slider?.getAttribute('data-navigation') || false,
            loop: this.slider?.getAttribute('data-loop') || false,
            ...params
        }
        this.currentIndex = 0;
    }

    init() {
        this.setWidthSlide();
        this.btnNextSlide();
        this.btnPrevSlide();
        this.onAutoplay(true);
        [...this.sliderWrpper.children].forEach((el, index) => {
            el.append(index)
        })
    }

    createPagination() {

    }

    getWidthSlide() {
        return (this.widthSlideWrapper / this.params.items - this.params.margin + (this.params.margin / 3));
    }

    setWidthSlide() {
        [...this.sliderWrpper.children].forEach(el => {
            el.style.width = `${this.getWidthSlide()}px`;
        })
    }

    onLoop() {
        const addAndRemoveAnimation = (width) => {
            this.sliderWrpper.style.transition = 'none';
            this.sliderWrpper.style.transform = `translateX(-${width}px)`;
            setTimeout(() => {
                this.sliderWrpper.style.transition = 'all .5s ease-in-out';
                this.sliderWrpper.style.transform = `translateX(-${this.transform}px)`;
            }, 5000)
        }

        const next = () => {
            const node = this.sliderWrpper.firstElementChild;
            this.sliderWrpper.appendChild(node);
            addAndRemoveAnimation(this.transform - this.getWidthSlide() + this.params.margin);
        }

        const prev = () => {
            const node = this.sliderWrpper.lastElementChild;
            this.sliderWrpper.prepend(node);

            addAndRemoveAnimation(this.getWidthSlide() + this.params.margin)
        }

        return {
            next,
            prev
        }
    }

    onAutoplay(on) {
        if(on && this.params.autoplay) {
            this.interval = setInterval(() => {
                this.nextSlide();
            }, this.params.autoplayDelay);
        }

        if(!on) {
            clearInterval(this.interval)
            clearInterval(this.timeout)
            this.timeout = setTimeout(() => {
                this.onAutoplay(true);
            }, this.params.autoplayDelay / 2)
        }
    }

    nextSlide() {
        if(this.currentIndex < this.params.items) {
            this.goToSlide(this.currentIndex + 1);
        }else if(this.currentIndex >= this.params.items && !this.params.loop) {
            this.goToSlide(0);
        }else if(this.currentIndex >= this.params.items && this.params.loop) {
            this.onLoop().next();
        }
    }

    prevSlide() {
        if(this.currentIndex > 0) {
            this.goToSlide(this.currentIndex - 1);
        } else if(this.currentIndex <= 0 && this.params.loop) {
            this.onLoop().prev();
        }
    }

    btnNextSlide() {
        if(this.params.navigation) {
            const btnNext = this.slider.querySelector('.carousel-button-next');

            btnNext.addEventListener('click', () => {
                this.nextSlide();
                this.onAutoplay(false)
            })
        }
    }

    btnPrevSlide() {
        if(this.params.navigation) {
            const btnPrev = this.slider.querySelector('.carousel-button-prev');

            btnPrev.addEventListener('click', () => {
                this.prevSlide();
                this.onAutoplay(false);
            })
        }
    }

    goToSlide(index) {
        this.transform = this.getWidthSlide() * index;
        this.sliderWrpper.style.transform = `translateX(-${this.transform + (this.params.margin * index)}px)`;
        this.currentIndex = index;
    }
}

export  default  Carousel;