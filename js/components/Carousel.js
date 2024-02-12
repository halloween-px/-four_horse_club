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
            group: this.slider?.getAttribute('data-group-items') || false,
            loop: this.slider?.getAttribute('data-loop') || false,
            ...params
        }
        this.currentIndex = 0;
    }

    init() {
        if(!this.slider) return;

        this.setWidthSlide();
        this.btnNextSlide();
        this.btnPrevSlide();
        this.onAutoplay(true);
        this.createPagination();
        [...this.sliderWrpper.children].forEach((el, index) => {
            el.append(index)
        })
    }

    createPagination() {
        if(!this.params.pagination) return;
        const pagination = this.slider.querySelector('.carousel-pagination');
        const param = this.slider?.hasAttribute('data-pagination-number') ? 'number' : 'dot';
        if(!pagination) return;

        const createNumberPagination = () => {
            const countStart = this.params.items;
            const countEnd = this.countSlide;
            pagination.insertAdjacentHTML(`beforeend`, `
                <span class="pagination-number-start">${countStart}</span>
                 / 
                 <span class="pagination-number-end">${countEnd}</span>
            `);
        }

        switch (param) {
            case 'number':
                createNumberPagination();
                break
        }
    }

    updatePagination() {
        const updateNumber = (value) => {
            let count = value === 0 ? this.params.items : value * (this.countSlide / this.params.items);
            const pagination = this.slider.querySelector('.pagination-numbers .pagination-number-start');
            let number = this.params.group ? count : 1;

            if(pagination) {
                pagination.textContent = number;
            }
        }

        return {
            updateNumber,
        }
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
                this.goToSlide(this.currentIndex);
            }, 0)
        }

        const next = () => {
            const node = this.params.group ?
                [...this.sliderWrpper.children].slice(0, this.params.items) :
                this.sliderWrpper.firstElementChild;

            if(!node.length) {
                this.sliderWrpper.appendChild(node);
                addAndRemoveAnimation(this.transform - this.getWidthSlide() - this.params.margin);
                return;
            }

            node.forEach(el => {
                this.sliderWrpper.appendChild(el);
            });

            addAndRemoveAnimation(
                this.transform -
                (this.getWidthSlide() * this.params.items) -
                (this.params.margin * this.params.items)
            );
        }

        const prev = () => {
            const node = this.params.group ?
                [...this.sliderWrpper.children].slice(this.params.items, this.countSlide).reverse() :
                this.sliderWrpper.firstElementChild;

            if(!node.length) {
                this.sliderWrpper.prepend(node);
                addAndRemoveAnimation(this.getWidthSlide() + this.params.margin)
                return;
            }

            node.forEach(el => {
                this.sliderWrpper.prepend(el);
            });

            addAndRemoveAnimation(
                (this.getWidthSlide() * this.params.items) +
                (this.params.margin * this.params.items)
            );

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
        if(this.currentIndex < this.countSlide && this.currentIndex < this.params.items) {
            if(this.params.group) {
                this.goToSlide(this.currentIndex + this.params.items);
            } else {
                this.goToSlide(this.currentIndex + 1);
            }
        }else if(this.currentIndex >= this.params.items && !this.params.loop) {
            this.goToSlide(0);
        }else if(this.currentIndex >= this.params.items && this.params.loop) {
            this.onLoop().next();
        }
    }

    prevSlide() {
        if(this.currentIndex > 0) {
            if(this.params.group) {
                this.goToSlide(this.currentIndex - this.params.items);
            } else {
                this.goToSlide(this.currentIndex - 1);
            }
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
        this.transform = (this.getWidthSlide() * index) + (this.params.margin * index);
        this.sliderWrpper.style.transform = `translateX(-${this.transform}px)`;
        this.currentIndex = index;
        console.log(index)
        this.updatePagination().updateNumber(index);
    }
}

export  default  Carousel;