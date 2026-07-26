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
        country: "MBBS Student, Russia",
        image: "images/student3.png",
        rating: 3,
        review: "They helped me achieve my dream of studying abroad."
    }
];



/* async function loadCarouselImages() {
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

loadCarouselImages(); */

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

async function loadCountries() {

    const response = await fetch("/api/countries");

    const countries = await response.json();

    const select = document.getElementById("country");

    countries.forEach(country => {

        const option = document.createElement("option");

        option.value = country;

        option.textContent = country;

        select.appendChild(option);

    });

}

loadCountries();



async function loadCourses() {

    const response = await fetch("/api/courses");

    const courses = await response.json();

    const select = document.getElementById("course");

    courses.forEach(course => {

        const option = document.createElement("option");

        option.value = course;

        option.textContent = course;

        select.appendChild(option);

    });

}

loadCourses();








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

// ── Study Destinations ──────────────────────────────────────────

const countryFlags = {
    "India":       "./images/countries_icon/india_icon.png",
    "Uzbekistan":  "./images/countries_icon/uzbekistan_icon.png",
    "Russia":      "./images/countries_icon/russia_icon.png",
    "Kazakhstan":  "./images/countries_icon/kazakhistan_icon.png",
    "Georgia":     "./images/countries_icon/georgia_icon.png",
};

const countryTaglines = {
    "India":       "Top-ranked universities at home",
    "Uzbekistan":  "Affordable & WHO-recognised",
    "Russia":      "World-class research universities",
    "Kazakhstan":  "Modern campuses in Central Asia",
    "Georgia":     "European standards of education",
};

let allUniversities = [];
let currentCountry  = null;

const countriesGrid     = document.getElementById("countriesGrid");
const universitiesView  = document.getElementById("universitiesView");
const universitiesGrid  = document.getElementById("universitiesGrid");
const selectedCountryTitle = document.getElementById("selectedCountryTitle");
const backBtn           = document.getElementById("backToCountriesBtn");
const searchInput       = document.getElementById("universitySearchInput");
const searchClearBtn    = document.getElementById("searchClearBtn");
const noResultsMsg      = document.getElementById("noResultsMsg");

function renderCountryCard(country, count) {
    console.log("country flag",country)
    return `
        <div class="country-card" data-country="${country}">
            <div class="country-flag"><img src="${countryFlags[country]}" alt="${country} flag" onerror="this.replaceWith('\uD83C\uDF0D')"></div>
            <h4 class="country-name">${country}</h4>
            <p class="country-tagline">${countryTaglines[country] || ""}</p>
            <span class="country-uni-count">${count} ${count === 1 ? "University" : "Universities"}</span>
            <div class="country-card-arrow"><i class="bi bi-arrow-right-circle-fill"></i></div>
        </div>
    `;
}

function renderUniversityCard(u) {
    console.log("u",u)
    return `
        <div class="university-card">
            <div class="university-card-body">
                <h4 class="uni-name">${u.name}</h4>
                <p class="university-location">
                    <i class="bi bi-geo-alt-fill"></i> ${u.city}, ${u.country}
                </p>
                <p class="university-desc">${u.description}</p>
                <div class="university-card-footer">
                    <span class="uni-type-badge ${u.type === "Government" ? "govt" : "pvt"}">${u.type}</span>
                </div>
            </div>
        </div>
    `;
}

function showCountriesView() {
    currentCountry = null;
    universitiesView.style.display = "none";
    countriesGrid.style.display    = "grid";
    searchInput.value              = "";
    searchClearBtn.style.display   = "none";
    noResultsMsg.style.display     = "none";
}

function showUniversitiesForCountry(country) {

    console.log("country",country,allUniversities)
    currentCountry = country;
    const filtered = allUniversities.filter(u => u.country === country);
    console.log("filtered",filtered)
    selectedCountryTitle.innerHTML = `${countryFlags[country] ? `<img src="${countryFlags[country]}" alt="${country} flag" style="height:1.2em;vertical-align:middle;margin-right:6px;">` : ""} ${country}`;
    countriesGrid.style.display    = "none";
    universitiesView.style.display = "block";
    searchInput.value              = "";
    searchClearBtn.style.display   = "none";
    renderUniversityList(filtered);
    document.getElementById("study-destinations").scrollIntoView({ behavior: "smooth", block: "end" });
}

function renderUniversityList(list) {
    console.log("list of countrues",list)
    if (list.length === 0) {
        universitiesGrid.innerHTML = "";
        noResultsMsg.style.display = "block";
    } else {
        noResultsMsg.style.display = "none";
        universitiesGrid.innerHTML = list.map(renderUniversityCard).join("");
    }
}

function handleSearch(query) {
    const q = query.trim().toLowerCase();
    searchClearBtn.style.display = q ? "flex" : "none";

    if (!q) {
        if (currentCountry) {
            showUniversitiesForCountry(currentCountry);
        } else {
            showCountriesView();
        }
        return;
    }

    const results = allUniversities.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.city.toLowerCase().includes(q) ||
        u.country.toLowerCase().includes(q)
    );

    countriesGrid.style.display    = "none";
    universitiesView.style.display = "block";
    selectedCountryTitle.innerHTML = `Search results for "<em>${query}</em>"`;
    renderUniversityList(results);
}

async function initStudyDestinations() {
    const res = await fetch("/api/universities");
    allUniversities = await res.json();

    const countryCounts = allUniversities.reduce((acc, u) => {
        acc[u.country] = (acc[u.country] || 0) + 1;
        return acc;
    }, {});

    countriesGrid.innerHTML = Object.entries(countryCounts)
        .sort(([a], [b]) => {
            if (a === "India") return -1;
            if (b === "India") return 1;
            return a.localeCompare(b);
        })
        .map(([country, count]) => renderCountryCard(country, count))
        .join("");

    countriesGrid.addEventListener("click", e => {
        const card = e.target.closest(".country-card");
        if (card) showUniversitiesForCountry(card.dataset.country);
    });

    backBtn.addEventListener("click", showCountriesView);

    searchInput.addEventListener("input", e => handleSearch(e.target.value));

    searchClearBtn.addEventListener("click", () => {
        searchInput.value = "";
        searchClearBtn.style.display = "none";
        if (currentCountry) {
            showUniversitiesForCountry(currentCountry);
        } else {
            showCountriesView();
        }
    });
}

initStudyDestinations();








//Form Js starts form here

const form = document.getElementById("consultationForm");

const fullName = document.getElementById("fullName");
const phone = document.getElementById("phone");
const country = document.getElementById("country");
const course = document.getElementById("course");

function showError(input, message){

    input.classList.remove("input-success");
    input.classList.add("input-error");

    document.getElementById(input.id + "Error").innerText = message;

}

function showSuccess(input){

    input.classList.remove("input-error");
    input.classList.add("input-success");

    document.getElementById(input.id + "Error").innerText = "";

}

function validateName(){

    const value = fullName.value.trim();

    if(value===""){

        showError(fullName,"Full name is required");

        return false;

    }

    if(value.length < 3){

        showError(fullName,"Minimum 3 characters required");

        return false;

    }

    if(!/^[A-Za-z ]+$/.test(value)){

        showError(fullName,"Only alphabets are allowed");

        return false;

    }

    showSuccess(fullName);

    return true;

}

function validatePhone(){

    const value = phone.value.trim();

    if(value===""){

        showError(phone,"Phone number is required");

        return false;

    }

    if(!/^[0-9]{10,15}$/.test(value)){

        showError(phone,"Enter a valid phone number");

        return false;

    }

    showSuccess(phone);

    return true;

}

function validateCountry(){

    if(country.value===""){

        showError(country,"Please select a country");

        return false;

    }

    showSuccess(country);

    return true;

}

function validateCourse(){

    if(course.value===""){

        showError(course,"Please select a course");

        return false;

    }

    showSuccess(course);

    return true;

}

fullName.addEventListener("input",validateName);

phone.addEventListener("input",validatePhone);

country.addEventListener("change",validateCountry);

course.addEventListener("change",validateCourse);

form.addEventListener("submit",async function(e){

    e.preventDefault();

    const isValid =
        validateName() &
        validatePhone() &
        validateCountry() &
        validateCourse();

    if(!isValid)
        return;

    const submitBtn = document.getElementById("submitBtn");

    submitBtn.disabled = true;

    submitBtn.innerText = "Submitting...";

    const consultation = {

        fullName:fullName.value.trim(),

        phone:phone.value.trim(),

        country:country.value,

        course:course.value

    };

    console.log(consultation);

    // const response = await fetch("/api/consultation",{
    //     method:"POST",
    //     headers:{
    //         "Content-Type":"application/json"
    //     },
    //     body:JSON.stringify(consultation)
    // });

    // const result = await response.json();

    // alert("Consultation submitted successfully.");

    

    document
        .querySelectorAll(".input-success")
        .forEach(input=>input.classList.remove("input-success"));

    submitBtn.disabled = false;

    submitBtn.innerText = "Book Free Consultation";

});




form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const consultation = {
        fullName: document.getElementById("fullName").value,
        phone: document.getElementById("phone").value,
        country: document.getElementById("country").value,
        course: document.getElementById("course").value
    };

    try {

        const response = await fetch("/api/consultation", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(consultation)

        });

        const result = await response.json();

        
        console.log("From Submitted successfully")
        form.reset();

    }
    catch (err) {

        console.log("Something went wrong")

    }

});
