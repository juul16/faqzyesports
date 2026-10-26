"use strict";

/*
 * Faqzy Esports application configuration.
 * Replace this placeholder with your real backend URL later.
 * Your backend must implement POST /api/applications.
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

const ALLOWED_TEAMS = ["RSC Team", "Competitive Team"];

/* FOOTER YEAR */
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

/* MOBILE NAVIGATION */
function closeMobileMenu() {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.remove("active");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
}

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = !navLinks.classList.contains("active");

        navLinks.classList.toggle("active", isOpen);
        menuToggle.classList.toggle("active", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });

    document.addEventListener("click", (event) => {
        if (
            navLinks.classList.contains("active") &&
            !navLinks.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            closeMobileMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 700) {
            closeMobileMenu();
        }
    });
}

/* TEAM SELECTION */
document.querySelectorAll("[data-tryout]").forEach((button) => {
    button.addEventListener("click", () => {
        const selectedTeam = button.dataset.tryout;

        if (!tryoutSelect || !ALLOWED_TEAMS.includes(selectedTeam)) {
            return;
        }

        tryoutSelect.value = selectedTeam;

        // Notify other scripts if they need to react to this change.
        tryoutSelect.dispatchEvent(new Event("change", { bubbles: true }));

        const applicationSection = document.getElementById("application");

        if (applicationSection) {
            const reduceMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            applicationSection.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "start"
            });

            window.setTimeout(() => {
                tryoutSelect.focus({ preventScroll: true });
            }, reduceMotion ? 0 : 450);
        }
    });
});

/* APPLICATION STATUS */
function showStatus(message, type) {
    if (!applicationStatus) return;

    applicationStatus.textContent = message;
    applicationStatus.className = `form-status ${type}`;
    applicationStatus.hidden = false;
}

function clearStatus() {
    if (!applicationStatus) return;

    applicationStatus.textContent = "";
    applicationStatus.className = "form-status";
    applicationStatus.hidden = true;
}

/* APPLICATION FORM */
if (applicationForm) {
    applicationForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearStatus();

        // Browser validation: required fields, formats and length limits.
        if (!applicationForm.reportValidity()) {
            return;
        }

        // Leave the placeholder in place until the real backend is ready.
        if (
            !API_URL ||
            API_URL.includes("YOUR-BOT-HOST") ||
            !/^https?:\/\//i.test(API_URL)
        ) {
            showStatus(
                "The form is ready, but the backend URL has not been configured yet.",
                "error"
            );

            console.warn(
                "Faqzy Esports: set API_URL in script.js to your real backend URL."
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

        // Extra validation before sending anything to the backend.
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
            showStatus("Please complete all required fields.", "error");
            return;
        }

        if (
            !Number.isInteger(application.age) ||
            application.age < 13 ||
            application.age > 99
        ) {
            showStatus("Please enter a valid age.", "error");
            return;
        }

        if (!ALLOWED_TEAMS.includes(application.tryout)) {
            showStatus(
                "Please select RSC Team or Competitive Team.",
                "error"
            );
            return;
        }

        if (application.playerName.length > 50 ||
            application.discord.length > 50 ||
            application.peakRank.length > 50 ||
            application.experience.length > 1500 ||
            application.availability.length > 500) {
            showStatus("One or more fields are too long.", "error");
            return;
        }

        if (application.experience.length < 10) {
            showStatus(
                "Please provide at least 10 characters about your experience.",
                "error"
            );
            return;
        }

        if (application.availability.length < 3) {
            showStatus(
                "Please provide more information about your availability.",
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
                    throw new Error("Unsupported URL protocol");
                }
            } catch {
                showStatus(
                    "Please enter a valid tracker URL or leave it empty.",
                    "error"
                );
                return;
            }
        }

        if (!submitButton) {
            showStatus(
                "The submit button could not be found. Please reload the page.",
                "error"
            );
            return;
        }

        const originalButtonHTML = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";

        try {
            const response = await fetch(
                `${API_URL.replace(/\/+$/, "")}/api/applications`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(application)
                }
            );

            // Support JSON responses as well as empty responses.
            const responseText = await response.text();
            let result = {};

            if (responseText) {
                try {
                    result = JSON.parse(responseText);
                } catch {
                    result = {};
                }
            }

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    result.error ||
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
            console.error("Application submission failed:", error);

            showStatus(
                "We couldn't submit your application. Please check your connection and try again later.",
                "error"
            );
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonHTML;
        }
    });
}

/* SCROLL REVEAL ANIMATIONS */
const revealElements = document.querySelectorAll(".reveal");

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (
    prefersReducedMotion ||
    !("IntersectionObserver" in window)
) {
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
            threshold: 0.12,
            rootMargin: "0px 0px -30px 0px"
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
}

/* ACTIVE NAVIGATION LINK */
const pageSections = document.querySelectorAll("main section[id]");
const navigationLinks = document.querySelectorAll(
    '.nav-links a[href^="#"]'
);

if ("IntersectionObserver" in window && pageSections.length > 0) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

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
