/* =========================================
   FAQZY ESPORTS
   Navigation + Applications + Animations
========================================= */

"use strict";

/*
 * IMPORTANT:
 * Replace this placeholder with your real backend URL.
 * The backend must support POST /api/applications.
 */
const API_URL = "https://YOUR-BOT-HOST.example.com";

/* ELEMENTS */

const applicationForm = document.getElementById("applicationForm");
const applicationStatus = document.getElementById("applicationStatus");
const submitButton = document.getElementById("submitApplication");
const tryoutSelect = document.getElementById("tryout");

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const currentYear = document.getElementById("currentYear");

/* =========================================
   FOOTER YEAR
========================================= */

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

/* =========================================
   MOBILE NAVIGATION
========================================= */

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("active");

        menuToggle.classList.toggle("active", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu after clicking a navigation link.
    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            menuToggle.classList.remove("active");

            menuToggle.setAttribute("aria-expanded", "false");
        });
    });

    // Close menu with Escape.
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            navLinks.classList.remove("active");
            menuToggle.classList.remove("active");

            menuToggle.setAttribute("aria-expanded", "false");
        }
    });
}

/* =========================================
   TRYOUT BUTTONS
   Only RSC Team and Competitive Team
========================================= */

document.querySelectorAll("[data-tryout]").forEach((button) => {
    button.addEventListener("click", () => {
        const selectedTeam = button.dataset.tryout;

        if (tryoutSelect) {
            tryoutSelect.value = selectedTeam;
        }

        const applicationSection = document.getElementById("application");

        if (applicationSection) {
            const reducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            applicationSection.scrollIntoView({
                behavior: reducedMotion ? "auto" : "smooth",
                block: "start"
            });
        }
    });
});

/* =========================================
   APPLICATION STATUS
========================================= */

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

/* =========================================
   APPLICATION FORM SUBMISSION
========================================= */

if (applicationForm) {
    applicationForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        clearStatus();

        // Check required HTML form fields.
        if (!applicationForm.reportValidity()) {
            return;
        }

        // Prevent submission if the backend URL is still a placeholder.
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
                "Configure API_URL in script.js with your real backend URL."
            );

            return;
        }

        const formData = new FormData(applicationForm);

        const application = {
            playerName: String(
                formData.get("playerName") || ""
            ).trim(),

            discord: String(
                formData.get("discord") || ""
            ).trim(),

            age: Number(formData.get("age")),

            region: String(
                formData.get("region") || ""
            ),

            rank: String(
                formData.get("rank") || ""
            ),

            peakRank: String(
                formData.get("peakRank") || ""
            ).trim(),

            platform: String(
                formData.get("platform") || ""
            ),

            tryout: String(
                formData.get("tryout") || ""
            ),

            tracker: String(
                formData.get("tracker") || ""
            ).trim(),

            experience: String(
                formData.get("experience") || ""
            ).trim(),

            availability: String(
                formData.get("availability") || ""
            ).trim(),

            confirmInfo: formData.get("confirmInfo") === "on"
        };

        // Only these two teams are allowed.
        const allowedTeams = [
            "RSC Team",
            "Competitive Team"
        ];

        if (
            !application.playerName ||
            !application.discord ||
            !application.region ||
            !application.rank ||
            !application.peakRank ||
            !application.platform ||
            !application.experience ||
            !application.availability ||
            !application.confirmInfo
        ) {
            showStatus(
                "Please complete all required fields.",
                "error"
            );

            return;
        }

        if (!allowedTeams.includes(application.tryout)) {
            showStatus(
                "Please select RSC Team or Competitive Team.",
                "error"
            );

            return;
        }

        if (
            !Number.isFinite(application.age) ||
            application.age < 13 ||
            application.age > 99
        ) {
            showStatus(
                "Please enter a valid age.",
                "error"
            );

            return;
        }

        // Validate the optional tracker URL.
        if (application.tracker) {
            try {
                const trackerUrl = new URL(application.tracker);

                if (
                    trackerUrl.protocol !== "https:" &&
                    trackerUrl.protocol !== "http:"
                ) {
                    throw new Error("Invalid URL protocol");
                }
            } catch {
                showStatus(
                    "Please enter a valid tracker URL or leave it empty.",
                    "error"
                );

                return;
            }
        }

        const originalButtonHTML = submitButton
            ? submitButton.innerHTML
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
                // The server did not return JSON.
            }

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    result.error ||
                    `Server error (${response.status})`
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
                "We couldn't submit your application. Please try again later.",
                "error"
            );

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonHTML;
            }
        }
    });
}

/* =========================================
   SCROLL REVEAL ANIMATIONS
========================================= */

const revealElements = document.querySelectorAll(".reveal");

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (
    prefersReducedMotion ||
    !("IntersectionObserver" in window)
) {
    // Show everything if animations are disabled or unsupported.
    revealElements.forEach((element) => {
        element.classList.add("visible");
    });

} else {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");

                    // Animate each element only once.
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -30px 0px"
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
}

/* =========================================
   ACTIVE NAVIGATION LINK
========================================= */

const pageSections = document.querySelectorAll(
    "main section[id]"
);

const navigationLinks = document.querySelectorAll(
    '.nav-links a[href^="#"]'
);

if (
    "IntersectionObserver" in window &&
    pageSections.length > 0
) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                const currentId = entry.target.id;

                navigationLinks.forEach((link) => {
                    const isActive =
                        link.getAttribute("href") === `#${currentId}`;

                    link.classList.toggle("active", isActive);
                });
            });
        },
        {
            rootMargin: "-25% 0px -60% 0px"
        }
    );

    pageSections.forEach((section) => {
        sectionObserver.observe(section);
    });
}
