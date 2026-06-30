const carouselContainer = document.getElementById("carouselImages");
let galleryImages = [];
const track = document.getElementById("galleryTrack");
const testimonials = [
    {
        name: "Sarah Khan",
        country: "MBBS Student, Uzbekistan",
        image: "images/student1.png",
        rating: 5,
        review: "The entire admission process was smooth and transparent."
    },
    {
        name: "Ahmed Ali",
        country: "Medical Student, Kazakhstan",
        image: "images/student2.png",
        rating: 4,
        review: "The team guided me from counseling to visa approval."
    },
    {
        name: "Priya Sharma",
        country: "MBBS Student, Kyrgyzstan",
        image: "images/student3.png",
        rating: 3,
        review: "They helped me achieve my dream of studying abroad."
    }
];



async function loadCarouselImages() {
    const response = await fetch("/api/carousel_images");
    const images = await response.json();

    carouselContainer.innerHTML = "";

    images.forEach((image, index) => {
        const carouselItem = document.createElement("div");

        carouselItem.className =
            index === 0
                ? "carousel-item active"
                : "carousel-item";

        carouselItem.innerHTML = `
            <img src="${image}"
                 class="d-block w-100"
                 alt="Carousel Image ${index + 1}">
        `;

        carouselContainer.appendChild(carouselItem);
    });
}

loadCarouselImages();

fetch("/api/testimonial_images")
  .then(res => res.json())
    .then(images => {
        testimonials.forEach((student, index) => {
            if (images[index]) {
                student.image = images[index];
            }
        });

        renderTestimonials();
    })

async function loadGalleryImages() {

    const response = await fetch("/api/gallery_images");
    
    galleryImages = await response.json();
    galleryImages.forEach(image => {

        track.innerHTML += `
            <div class="gallery-item">
                <img src="${image}" alt="Student Gallery">
            </div>
        `;
    });
   galleryCarousel.move();

}

loadGalleryImages();



const testimonialTrack =
    document.getElementById("testimonialTrack");

function renderTestimonials() {
    let html = "";

    testimonials.forEach(student => {
        const stars = "★".repeat(student.rating);

        html += `
            <div class="testimonial-slide">
                <div class="testimonial-card">
                    <div class="student-image">
                        <img src="${student.image}" alt="${student.name}">
                    </div>

                    <div class="stars">${stars}</div>

                    <p class="testimonial-text">
                        "${student.review}"
                    </p>

                    <h5>${student.name}</h5>
                    <span>${student.country}</span>
                </div>
            </div>
        `;
    });

    testimonialTrack.innerHTML = html;
    testimonialCarousel.move();
}








function createCarousel(options) {

    const {
        track,
        prevBtn,
        nextBtn,
        itemSelector,
        totalItems,
        autoSlide = false,
        interval = 3000
    } = options;

    let currentIndex = 0;

    function getVisibleItems() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 992) return 2;
        return 3;
    }

    function move() {

        const items = track.querySelectorAll(itemSelector);

        if (!items.length) return;

        const itemWidth = items[0].offsetWidth;

        const maxIndex = Math.max(
            0,
            totalItems() - getVisibleItems()
        );

        if (currentIndex > maxIndex)
            currentIndex = maxIndex;

        track.style.transform =
            `translateX(-${currentIndex * itemWidth}px)`;
    }

    nextBtn.addEventListener("click", () => {

        if (currentIndex < totalItems() - getVisibleItems()) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }

        move();
    });

    prevBtn.addEventListener("click", () => {

        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex =
                Math.max(0, totalItems() - getVisibleItems());
        }

        move();
    });

    window.addEventListener("resize", move);

    if (autoSlide) {

        setInterval(() => {

            if (currentIndex >= totalItems() - getVisibleItems()) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }

            move();

        }, interval);
    }

    return {
        move
    };
}

const galleryCarousel = createCarousel({

    track: document.getElementById("galleryTrack"),

    prevBtn: document.querySelector(".prev-btn"),

    nextBtn: document.querySelector(".next-btn"),

    itemSelector: ".gallery-item",

    totalItems: () => galleryImages.length,

    autoSlide: true,

    interval: 3000

});
galleryCarousel.move();

const testimonialCarousel = createCarousel({

    track: document.getElementById("testimonialTrack"),

    prevBtn: document.querySelector(".prev-testimonial"),

    nextBtn: document.querySelector(".next-testimonial"),

    itemSelector: ".testimonial-slide",

    totalItems: () => testimonials.length,

    autoSlide: true,

    interval: 5000

});



document.querySelectorAll("[data-scroll]").forEach(link => {

    link.addEventListener("click", function () {

        const target = this.dataset.scroll;

        if (target === "top") {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            return;
        }

        const section = document.getElementById(target);

        if (section) {

            section.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

});
