"use strict";


/* =========================================================
   API CONFIGURATION
========================================================= */

const API_URL =
    "https://faqzy-applications.cloudwolkofficial.workers.dev";


/* =========================================================
   ELEMENTS
========================================================= */

const applicationForm =
    document.getElementById("applicationForm");

const applicationStatus =
    document.getElementById("applicationStatus");

const submitButton =
    document.getElementById("submitApplication");

const tryoutSelect =
    document.getElementById("tryout");

const menuToggle =
    document.getElementById("menuToggle");

const navLinks =
    document.getElementById("navLinks");

const currentYear =
    document.getElementById("currentYear");


const ALLOWED_TEAMS = [
    "RSC Team",
    "Competitive Team"
];



/* =========================================================
   FOOTER YEAR
========================================================= */

if (currentYear) {
    currentYear.textContent =
        new Date().getFullYear();
}



/* =========================================================
   MOBILE NAVIGATION
========================================================= */

function closeMobileMenu() {

    if (!menuToggle || !navLinks) {
        return;
    }

    navLinks.classList.remove("active");
    menuToggle.classList.remove("active");

    menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );

    menuToggle.setAttribute(
        "aria-label",
        "Open navigation"
    );
}


if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        const isOpen =
            !navLinks.classList.contains("active");

        navLinks.classList.toggle(
            "active",
            isOpen
        );

        menuToggle.classList.toggle(
            "active",
            isOpen
        );

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation"
                : "Open navigation"
        );
    });


    navLinks
        .querySelectorAll("a")
        .forEach((link) => {

            link.addEventListener(
                "click",
                closeMobileMenu
            );
        });


    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {
                closeMobileMenu();
            }
        }
    );


    document.addEventListener(
        "click",
        (event) => {

            if (
                navLinks.classList.contains("active") &&
                !navLinks.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMobileMenu();
            }
        }
    );


    window.addEventListener(
        "resize",
        () => {

            if (window.innerWidth > 700) {
                closeMobileMenu();
            }
        }
    );
}



/* =========================================================
   TEAM SELECTION
========================================================= */

document
    .querySelectorAll("[data-tryout]")
    .forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const selectedTeam =
                    button.dataset.tryout;

                if (
                    !tryoutSelect ||
                    !ALLOWED_TEAMS.includes(selectedTeam)
                ) {
                    return;
                }


                tryoutSelect.value =
                    selectedTeam;

                tryoutSelect.dispatchEvent(
                    new Event("change", {
                        bubbles: true
                    })
                );


                const applicationSection =
                    document.getElementById(
                        "application"
                    );


                if (applicationSection) {

                    const reduceMotion =
                        window.matchMedia(
                            "(prefers-reduced-motion: reduce)"
                        ).matches;


                    applicationSection.scrollIntoView({
                        behavior:
                            reduceMotion
                                ? "auto"
                                : "smooth",

                        block: "start"
                    });


                    window.setTimeout(
                        () => {

                            tryoutSelect.focus({
                                preventScroll:
                                    true
                            });

                        },

                        reduceMotion
                            ? 0
                            : 450
                    );
                }
            }
        );
    });



/* =========================================================
   APPLICATION STATUS
========================================================= */

function showStatus(
    message,
    type
) {

    if (!applicationStatus) {
        return;
    }

    applicationStatus.textContent =
        message;

    applicationStatus.className =
        `form-status ${type}`;

    applicationStatus.hidden =
        false;
}


function clearStatus() {

    if (!applicationStatus) {
        return;
    }

    applicationStatus.textContent =
        "";

    applicationStatus.className =
        "form-status";

    applicationStatus.hidden =
        true;
}



/* =========================================================
   APPLICATION FORM
========================================================= */

if (applicationForm) {

    applicationForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            clearStatus();


            if (
                !applicationForm.reportValidity()
            ) {
                return;
            }


            const formData =
                new FormData(
                    applicationForm
                );


            const application = {

                playerName:
                    String(
                        formData.get(
                            "playerName"
                        ) || ""
                    ).trim(),

                discord:
                    String(
                        formData.get(
                            "discord"
                        ) || ""
                    ).trim(),

                age:
                    Number(
                        formData.get(
                            "age"
                        )
                    ),

                region:
                    String(
                        formData.get(
                            "region"
                        ) || ""
                    ).trim(),

                rank:
                    String(
                        formData.get(
                            "rank"
                        ) || ""
                    ).trim(),

                peakRank:
                    String(
                        formData.get(
                            "peakRank"
                        ) || ""
                    ).trim(),

                platform:
                    String(
                        formData.get(
                            "platform"
                        ) || ""
                    ).trim(),

                tryout:
                    String(
                        formData.get(
                            "tryout"
                        ) || ""
                    ).trim(),

                tracker:
                    String(
                        formData.get(
                            "tracker"
                        ) || ""
                    ).trim(),

                experience:
                    String(
                        formData.get(
                            "experience"
                        ) || ""
                    ).trim(),

                availability:
                    String(
                        formData.get(
                            "availability"
                        ) || ""
                    ).trim(),

                joinReason:
                    String(
                        formData.get(
                            "joinReason"
                        ) || ""
                    ).trim(),

                weeklyHours:
                    String(
                        formData.get(
                            "weeklyHours"
                        ) || ""
                    ).trim(),

                longTermGoals:
                    String(
                        formData.get(
                            "longTermGoals"
                        ) || ""
                    ).trim(),

                confirmInfo:
                    formData.get(
                        "confirmInfo"
                    ) === "on"
            };


            /* REQUIRED FIELD VALIDATION */

            if (
                !application.playerName ||
                !application.discord ||
                !application.region ||
                !application.rank ||
                !application.peakRank ||
                !application.platform ||
                !application.tryout ||
                !application.experience ||
                !application.availability ||
                !application.joinReason ||
                !application.weeklyHours ||
                !application.longTermGoals ||
                !application.confirmInfo
            ) {

                showStatus(
                    "Please complete all required fields.",
                    "error"
                );

                return;
            }


            /* AGE */

            if (
                !Number.isInteger(
                    application.age
                ) ||
                application.age < 13 ||
                application.age > 99
            ) {

                showStatus(
                    "Please enter a valid age.",
                    "error"
                );

                return;
            }


            /* TEAM */

            if (
                !ALLOWED_TEAMS.includes(
                    application.tryout
                )
            ) {

                showStatus(
                    "Please select a valid team.",
                    "error"
                );

                return;
            }


            /* LENGTH VALIDATION */

            const limits = {

                playerName: 50,
                discord: 50,
                region: 30,
                rank: 50,
                peakRank: 50,
                platform: 50,
                tracker: 500,
                experience: 1500,
                availability: 500,
                joinReason: 1500,
                weeklyHours: 500,
                longTermGoals: 1500
            };


            for (
                const [field, max]
                of Object.entries(limits)
            ) {

                if (
                    application[field].length >
                    max
                ) {

                    showStatus(
                        "One or more fields are too long.",
                        "error"
                    );

                    return;
                }
            }


            /* EXPERIENCE */

            if (
                application.experience.length <
                10
            ) {

                showStatus(
                    "Please provide at least 10 characters about your experience.",
                    "error"
                );

                return;
            }


            /* AVAILABILITY */

            if (
                application.availability.length <
                3
            ) {

                showStatus(
                    "Please provide more information about your availability.",
                    "error"
                );

                return;
            }


            /* TRACKER URL */

            if (application.tracker) {

                try {

                    const trackerUrl =
                        new URL(
                            application.tracker
                        );


                    if (
                        trackerUrl.protocol !== "https:" &&
                        trackerUrl.protocol !== "http:"
                    ) {

                        throw new Error(
                            "Unsupported URL protocol"
                        );
                    }

                } catch {

                    showStatus(
                        "Please enter a valid tracker URL or leave it empty.",
                        "error"
                    );

                    return;
                }
            }


            /* SUBMIT BUTTON */

            if (!submitButton) {

                showStatus(
                    "The submit button could not be found. Please reload the page.",
                    "error"
                );

                return;
            }


            const originalButtonHTML =
                submitButton.innerHTML;


            submitButton.disabled =
                true;

            submitButton.textContent =
                "Submitting...";


            try {

                const response =
                    await fetch(
                        `${API_URL}/api/applications`,
                        {
                            method:
                                "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Accept":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    application
                                )
                        }
                    );


                const responseText =
                    await response.text();


                let result = {};


                if (responseText) {

                    try {

                        result =
                            JSON.parse(
                                responseText
                            );

                    } catch {

                        result = {};
                    }
                }


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        `The server returned error ${response.status}.`
                    );
                }


                showStatus(
                    result.message ||
                    "Application submitted successfully! Thank you for applying to Faqzy Esports.",
                    "success"
                );


                applicationForm.reset();


            } catch (error) {

                console.error(
                    "Application submission failed:",
                    error
                );


                showStatus(
                    "We couldn't submit your application. Please check your connection and try again later.",
                    "error"
                );


            } finally {

                submitButton.disabled =
                    false;

                submitButton.innerHTML =
                    originalButtonHTML;
            }
        }
    );
}



/* =========================================================
   SCROLL REVEAL ANIMATIONS
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".reveal"
    );


const prefersReducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


if (
    prefersReducedMotion ||
    !("IntersectionObserver" in window)
) {

    revealElements.forEach(
        (element) => {

            element.classList.add(
                "visible"
            );
        }
    );

} else {

    const revealObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(
                    (entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );
                        }
                    }
                );

            },
            {
                threshold:
                    0.12,

                rootMargin:
                    "0px 0px -30px 0px"
            }
        );


    revealElements.forEach(
        (element) => {

            revealObserver.observe(
                element
            );
        }
    );
}



/* =========================================================
   ACTIVE NAVIGATION LINK
========================================================= */

const pageSections =
    document.querySelectorAll(
        "main section[id]"
    );


const navigationLinks =
    document.querySelectorAll(
        '.nav-links a[href^="#"]'
    );


if (
    "IntersectionObserver" in window &&
    pageSections.length > 0
) {

    const sectionObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        const currentId =
                            entry.target.id;


                        navigationLinks.forEach(
                            (link) => {

                                const isActive =
                                    link.getAttribute(
                                        "href"
                                    ) ===
                                    `#${currentId}`;


                                link.classList.toggle(
                                    "active",
                                    isActive
                                );
                            }
                        );
                    }
                );

            },
            {
                rootMargin:
                    "-25% 0px -60% 0px"
            }
        );


    pageSections.forEach(
        (section) => {

            sectionObserver.observe(
                section
            );
        }
    );
}



/* =========================================================
   FAQZY MERCH GALLERY
========================================================= */

(() => {

    const modal =
        document.getElementById(
            "merchModal"
        );


    /*
        De merch-code draait alleen op
        pagina's waarop de modal bestaat.
    */

    if (!modal) {
        return;
    }


    /* =====================================================
       PRODUCT DATA
    ===================================================== */

    const products = {

        jersey26: {

            name:
                "Faqzy Jersey '26",

            images: [
                "merch/usa-1.png",
                "merch/usa-2.png",
                "merch/usa-3.png",
                "merch/usa-4.png",
                "merch/usa-5.png"
            ]
        },


        white25: {

            name:
                "Faqzy Jersey '25 (White)",

            images: [
                "merch/white-1.png",
                "merch/white-2.png"
            ]
        },


        black25: {

            name:
                "Faqzy Jersey '25 (Black)",

            images: [
                "merch/black-1.png",
                "merch/black-2.png"
            ]
        }

    };



    /* =====================================================
       ELEMENTS
    ===================================================== */

    const modalImage =
        document.getElementById(
            "modalImage"
        );


    const modalName =
        document.getElementById(
            "modalProductName"
        );


    const counter =
        document.getElementById(
            "galleryCounter"
        );


    const thumbnails =
        document.getElementById(
            "galleryThumbnails"
        );


    const previousButton =
        modal.querySelector(
            ".gallery-prev"
        );


    const nextButton =
        modal.querySelector(
            ".gallery-next"
        );


    if (
        !modalImage ||
        !modalName ||
        !counter ||
        !thumbnails ||
        !previousButton ||
        !nextButton
    ) {

        console.error(
            "Merch gallery: required elements are missing."
        );

        return;
    }



    /* =====================================================
       STATE
    ===================================================== */

    let currentProduct =
        null;

    let currentImage =
        0;



    /* =====================================================
       CREATE THUMBNAILS
    ===================================================== */

    function createThumbnails() {

        thumbnails.innerHTML = "";

        if (!currentProduct) {
            return;
        }


        currentProduct.images.forEach(
            (image, index) => {

                const thumbnail =
                    document.createElement(
                        "button"
                    );


                thumbnail.type =
                    "button";


                thumbnail.className =
                    "gallery-thumbnail";


                thumbnail.setAttribute(
                    "aria-label",
                    `View image ${index + 1}`
                );


                const imageElement =
                    document.createElement(
                        "img"
                    );


                imageElement.src =
                    image;


                imageElement.alt =
                    `${currentProduct.name} thumbnail ${index + 1}`;


                imageElement.loading =
                    "lazy";


                thumbnail.appendChild(
                    imageElement
                );


                thumbnail.addEventListener(
                    "click",
                    () => {

                        currentImage =
                            index;

                        showImage();
                    }
                );


                thumbnails.appendChild(
                    thumbnail
                );
            }
        );
    }



    /* =====================================================
       UPDATE ACTIVE THUMBNAIL
    ===================================================== */

    function updateActiveThumbnail() {

        const thumbnailButtons =
            thumbnails.querySelectorAll(
                ".gallery-thumbnail"
            );


        thumbnailButtons.forEach(
            (button, index) => {

                const active =
                    index ===
                    currentImage;


                button.classList.toggle(
                    "active",
                    active
                );


                button.setAttribute(
                    "aria-current",
                    active
                        ? "true"
                        : "false"
                );
            }
        );
    }



    /* =====================================================
       SHOW IMAGE
    ===================================================== */

    function showImage() {

        if (!currentProduct) {
            return;
        }


        const images =
            currentProduct.images;


        modalImage.src =
            images[currentImage];


        modalImage.alt =
            `${currentProduct.name} - image ${currentImage + 1}`;


        counter.textContent =
            `${currentImage + 1} / ${images.length}`;


        const hasMultipleImages =
            images.length > 1;


        previousButton.disabled =
            !hasMultipleImages;


        nextButton.disabled =
            !hasMultipleImages;


        previousButton.hidden =
            !hasMultipleImages;


        nextButton.hidden =
            !hasMultipleImages;


        counter.hidden =
            !hasMultipleImages;


        updateActiveThumbnail();
    }



    /* =====================================================
       OPEN PRODUCT
    ===================================================== */

    function openProduct(
        productId
    ) {

        const product =
            products[productId];


        if (!product) {
            return;
        }


        currentProduct =
            product;


        currentImage =
            0;


        modalName.textContent =
            product.name;


        createThumbnails();

        showImage();


        modal.classList.add(
            "is-open"
        );


        modal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "merch-modal-open"
        );


        /*
            Focus op de sluitknop
            voor betere keyboard-accessibility.
        */

        const closeButton =
            modal.querySelector(
                ".merch-close"
            );


        if (closeButton) {
            closeButton.focus();
        }
    }



    /* =====================================================
       CLOSE PRODUCT
    ===================================================== */

    function closeProduct() {

        modal.classList.remove(
            "is-open"
        );


        modal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "merch-modal-open"
        );


        currentProduct =
            null;


        currentImage =
            0;
    }



    /* =====================================================
       CHANGE IMAGE
    ===================================================== */

    function changeImage(
        direction
    ) {

        if (!currentProduct) {
            return;
        }


        const total =
            currentProduct.images.length;


        if (total <= 1) {
            return;
        }


        currentImage =
            (
                currentImage +
                direction +
                total
            ) % total;


        showImage();
    }



    /* =====================================================
       PRODUCT BUTTONS
    ===================================================== */

    document
        .querySelectorAll(
            "[data-product]"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        openProduct(
                            button.dataset.product
                        );
                    }
                );
            }
        );



    /* =====================================================
       CLOSE BUTTONS
    ===================================================== */

    modal
        .querySelectorAll(
            "[data-close-modal]"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    closeProduct
                );
            }
        );



    /* =====================================================
       GALLERY BUTTONS
    ===================================================== */

    previousButton.addEventListener(
        "click",
        () => {

            changeImage(-1);
        }
    );


    nextButton.addEventListener(
        "click",
        () => {

            changeImage(1);
        }
    );



    /* =====================================================
       KEYBOARD CONTROLS
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                !modal.classList.contains(
                    "is-open"
                )
            ) {
                return;
            }


            if (
                event.key ===
                "Escape"
            ) {

                closeProduct();

                return;
            }


            if (
                event.key ===
                "ArrowLeft"
            ) {

                changeImage(-1);

                return;
            }


            if (
                event.key ===
                "ArrowRight"
            ) {

                changeImage(1);
            }
        }
    );



    /* =====================================================
       PRELOAD PRODUCT IMAGES
    ===================================================== */

    Object.values(products)
        .forEach(
            (product) => {

                product.images.forEach(
                    (image) => {

                        const preload =
                            new Image();

                        preload.src =
                            image;
                    }
                );
            }
        );

})();
