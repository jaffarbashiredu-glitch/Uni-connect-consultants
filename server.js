const express = require("express");
const fs = require("fs");
const path = require("path");
const universities = require("./data/universities_list.json");
const app = express();

// Serve current folder
app.use(express.static(__dirname));

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

app.use((req, res) => {
    res.status(404).send("Page not found");
});












const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

