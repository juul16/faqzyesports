"use strict";

/*
|--------------------------------------------------------------------------
| CONFIGURATION
|--------------------------------------------------------------------------
|
| Replace this URL with the actual URL of your backend.
| Your backend must support POST /api/applications.
|
*/

const API_URL = "https://YOUR-BOT-HOST.example.com";

/*
|--------------------------------------------------------------------------
| ELEMENTS
|--------------------------------------------------------------------------
*/

const applicationForm = document.getElementById("applicationForm");
const applicationStatus = document.getElementById("applicationStatus");
const submitButton = document.getElementById("submitApplication");
const tryoutSelect = document.getElementById("tryout");

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const currentYear = document.getElementById("currentYear");

/*
|--------------------------------------------------------------------------
| FOOTER YEAR
|--------------------------------------------------------------------------
*/

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

/*
|--------------------------------------------------------------------------
| MOBILE NAVIGATION
|--------------------------------------------------------------------------
*/

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("active");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}

/*
|--------------------------------------------------------------------------
| TRYOUT BUTTONS
|--------------------------------------------------------------------------
|
| Clicking a tryout button selects the corresponding option in the form
| and takes the visitor to the application section.
|
*/

document.querySelectorAll("[data-tryout]").forEach((button) => {
    button.addEventListener("click", () => {
        const selectedTryout = button.dataset.tryout;

        if (tryoutSelect) {
            tryoutSelect.value = selectedTryout;
        }

        document.getElementById("application")?.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "auto"
                : "smooth",
            block: "start"
        });
    });
});

/*
|--------------------------------------------------------------------------
| APPLICATION STATUS
|--------------------------------------------------------------------------
*/

function showStatus(message, type) {
    if (!applicationStatus) {
        return;
    }

    applicationStatus.textContent = message;
    applicationStatus.className = `form-status ${type}`;
    applicationStatus.hidden = false;
}

function clearStatus() {
    if (!applicationStatus) {
        return;
    }

    applicationStatus.textContent = "";
    applicationStatus.className = "form-status";
    applicationStatus.hidden = true;
}

/*
|--------------------------------------------------------------------------
| APPLICATION SUBMISSION
|--------------------------------------------------------------------------
*/

if (applicationForm) {
    applicationForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearStatus();

        if (!applicationForm.reportValidity()) {
            return;
        }

        /*
         * Stop here if the example URL has not been replaced.
         * This prevents a request from being sent to a fake address.
         */

        if (
            !API_URL ||
            API_URL.includes("YOUR-BOT-HOST") ||
            !/^https?:\/\//i.test(API_URL)
        ) {
            showStatus(
                "The application form is ready, but the backend URL has not been configured yet.",
                "error"
            );

            console.error(
                "Configure API_URL in script.js with your actual backend URL."
            );

            return;
        }

        const formData = new FormData(applicationForm);

        const application = {
            playerName: String(formData.get("playerName") || "").trim(),
            discord: String(formData.get("discord") || "").trim(),
            age: Number(formData.get("age")),
            region: String(formData.get("region") || ""),
            rank: String(formData.get("rank") || ""),
            peakRank: String(formData.get("peakRank") || "").trim(),
            platform: String(formData.get("platform") || ""),
            tryout: String(formData.get("tryout") || ""),
            tracker: String(formData.get("tracker") || "").trim(),
            experience: String(formData.get("experience") || "").trim(),
            availability: String(formData.get("availability") || "").trim(),
            confirmInfo: formData.get("confirmInfo") === "on"
        };

        /*
         * Basic client-side checks.
         * The backend must validate the data again independently.
         */

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
            !application.confirmInfo
        ) {
            showStatus(
                "Please complete all required fields before submitting.",
                "error"
            );

            return;
        }

        if (application.age < 13 || application.age > 99) {
            showStatus(
                "Please enter a valid age.",
                "error"
            );

            return;
        }

        if (application.tracker) {
            try {
                const trackerUrl = new URL(application.tracker);

                if (
                    trackerUrl.protocol !== "https:" &&
                    trackerUrl.protocol !== "http:"
                ) {
                    throw new Error("Invalid tracker URL protocol.");
                }
            } catch {
                showStatus(
                    "Please enter a valid tracker URL or leave that field empty.",
                    "error"
                );

                return;
            }
        }

        /*
         * Disable the submit button to prevent duplicate submissions.
         */

        const originalButtonText = submitButton
            ? submitButton.textContent
            : "Submit Application";

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Submitting...";
        }

        try {
            const response = await fetch(
                `${API_URL.replace(/\/+$/, "")}/api/applications`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(application)
                }
            );

            let result = {};

            try {
                result = await response.json();
            } catch {
                // The server may return an empty or non-JSON response.
            }

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    result.error ||
                    `The server returned status ${response.status}.`
                );
            }

            showStatus(
                result.message ||
                "Application submitted successfully! Thank you for applying to Faqzy Esports.",
                "success"
            );

            applicationForm.reset();

        } catch (error) {
            console.error("Application submission failed:", error);

            showStatus(
                error.message ||
                "Something went wrong. Please try again later.",
                "error"
            );

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        }
    });
}

/*
|--------------------------------------------------------------------------
| SCROLL REVEAL ANIMATIONS
|--------------------------------------------------------------------------
|
| This adds the "visible" class when elements with the "reveal" class
| enter the viewport. Your style.css should define the corresponding
| animation styles.
|
*/

const revealElements = document.querySelectorAll(".reveal");

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
        element.classList.add("visible");
    });
} else {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
}
