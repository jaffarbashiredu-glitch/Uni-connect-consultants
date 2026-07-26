const express = require("express");
const fs = require("fs");
const path = require("path");
const universities = require("./data/universities_list.json");
const app = express();

// Serve current folder
app.use(express.static(__dirname));
app.use(express.json());

// Serve images
app.use("/images", express.static(path.join(__dirname, "images")));

// code for carousel Images
app.get("/api/carousel_images", (req, res) => {
    const imageFolder = path.join(__dirname, "images/carouselImages");

    fs.readdir(imageFolder, (err, files) => {
        if (err) {
            return res.status(500).json({
                error: "Unable to read images"
            });
        }

        const images = files.filter(file =>
            /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
        );

        res.json(
            images.map(file => `/images/carouselImages/${file}`)
        );
    });
});






// code for gallery images
app.get("/api/gallery_images", (req, res) => {

    const imageFolder = path.join(__dirname, "images/galleryImages");

    fs.readdir(imageFolder, (err, files) => {

        if (err) {
            return res.status(500).json({
                error: "Unable to read images"
            });
        }

        const images = files.filter(file =>
            /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
        );

        res.json(
            images.map(file => `/images/galleryImages/${file}`)
        );
    });
});




// code for testimonail Images

app.get("/api/testimonial_images", (req,res) => {
    const imageFolder = path.join(__dirname, "images/testimonialImages");
    fs.readdir (imageFolder, (err, files) =>{
          if (err) {
            return res.status(500).json({
                error: "Unable to read images"
            });
        }

        const images = files.filter(file =>
            /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
        );

        res.json(
            images.map(file => `/images/testimonialImages/${file}`)
        );
    })
})


// Get unique list of countries
app.get("/api/countries", (req, res) => {
    const countries = [...new Set(universities.map(u => u.country))].sort();
    res.json(countries);
});

// Get all universities, with optional ?country= filter
app.get("/api/universities", (req, res) => {
    const { country } = req.query;
    if (country) {
        const filtered = universities.filter(
            u => u.country.toLowerCase() === country.toLowerCase()
        );
        return res.json(filtered);
    }
    res.json(universities);
});

// Get university by id

app.get("/api/universities/:id", (req, res) => {

    const id = Number(req.params.id);

    const university = universities.find(
        university => university.id === id
    );

    if (!university) {
        return res.status(404).json({
            message: "University not found"
        });
    }

    res.json(university);

});
app.get("/api/countriesList", (req, res) => {

    const filePath = path.join(__dirname, "data", "countries.json");

    const countries = JSON.parse(fs.readFileSync(filePath));

    res.json(countries);

});


app.get("/api/courses", (req, res) => {

    const filePath = path.join(__dirname, "data", "courses.json");

    const courses = JSON.parse(fs.readFileSync(filePath));

    res.json(courses);

});


app.post("/api/consultation", (req, res) => {

    const { fullName, phone, country, course } = req.body;

    if (!fullName || !phone || !country || !course) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });
    }

    const filePath = path.join(__dirname, "data", "consultations.json");

    let consultations = [];

    if (fs.existsSync(filePath)) {
        consultations = JSON.parse(fs.readFileSync(filePath));
    }

    consultations.push({
        id: Date.now(),
        fullName,
        phone,
        country,
        course,
        createdAt: new Date()
    });

    fs.writeFileSync(
        filePath,
        JSON.stringify(consultations, null, 2)
    );

    res.json({
        success: true,
        message: "Consultation submitted successfully."
    });

});
























app.use((req, res) => {
    res.status(404).send("Page not found");
});












const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

