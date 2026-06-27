const carouselContainer = document.getElementById("carouselImages");
let galleryImages = [];
const track = document.getElementById("galleryTrack");
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
    moveCarousel();

}

loadGalleryImages();

let currentIndex = 0;

function getVisibleItems() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 992) return 2;
    return 3;
}

function moveCarousel() {
    const firstItem = document.querySelector(".gallery-item");
    if (!firstItem) return;

    const visibleItems = getVisibleItems();
    const itemWidth = firstItem.offsetWidth;

    track.style.transform =
        `translateX(-${currentIndex * itemWidth}px)`;

    const maxIndex = Math.max(0, galleryImages.length - visibleItems);

    if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
    }
}

document.querySelector(".next-btn")
.addEventListener("click", () => {

    const visibleItems = getVisibleItems();

    if(currentIndex < galleryImages.length - visibleItems){
        currentIndex++;
        moveCarousel();
    }
});

document.querySelector(".prev-btn")
.addEventListener("click", () => {

    if(currentIndex > 0){
        currentIndex--;
        moveCarousel();
    }
});

window.addEventListener("resize", moveCarousel);






setInterval(() => {

    const visibleItems = getVisibleItems();

    if(currentIndex >= galleryImages.length - visibleItems){
        currentIndex = 0;
    }else{
        currentIndex++;
    }

    moveCarousel();

}, 3000);



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
}

