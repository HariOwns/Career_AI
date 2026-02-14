document.addEventListener("DOMContentLoaded", function () {
    
    /* =========================
       ACTION CARD NAVIGATION
    ========================= */

    const newAssessmentCard =
        document.getElementById("newAssessmentCard");

    const uploadResumeCard =
        document.getElementById("uploadResumeCard");

    if (newAssessmentCard) {
        newAssessmentCard.addEventListener("click", function () {
            window.location.href = "assessment.html";
        });
    }

    if (uploadResumeCard) {
        uploadResumeCard.addEventListener("click", function () {
            window.location.href = "upload.html";
        });
    }

    /* =========================
       AUTH CHECK
    ========================== */

    const storedLogin =
        sessionStorage.getItem("isLoggedIn");

    const storedUser =
        sessionStorage.getItem("currentUser");

    if (storedLogin !== "true" || !storedUser) {
        window.location.href = "index.html";
        return;
    }

    const user =
        JSON.parse(storedUser);

    const welcomeText =
        document.getElementById("welcomeText");

    const welcomeSubText =
        document.getElementById("welcomeSubText");

    const emptyState =
        document.getElementById("emptyState");

    const recommendationSection =
        document.getElementById("recommendationSection");

    const startBtn =
        document.getElementById("startAssessmentBtn");

    const logoutBtn =
        document.querySelector(".nav-outline");

    const homeBtn =
        document.getElementById("homeBtn");

    if (welcomeText) {
        welcomeText.textContent =
            `Welcome back, ${user.name}!`;
    }

    if (homeBtn) {
        homeBtn.addEventListener("click", function () {
            window.location.href = "index.html";
        });
    }

    /* =========================
       LOAD HISTORY
    ========================== */

    const dashboardHistory =
        JSON.parse(localStorage.getItem("careerHistory")) || [];

    if (dashboardHistory.length === 0) {

        if (emptyState)
            emptyState.style.display = "block";

        if (recommendationSection)
            recommendationSection.style.display = "none";

        if (welcomeSubText) {
            welcomeSubText.textContent =
                "Start your career journey with an assessment or upload your resume.";
        }

    } else {

        if (emptyState)
            emptyState.style.display = "none";

        recommendationSection.style.display = "grid";
        recommendationSection.innerHTML = "";

        if (welcomeSubText) {
            welcomeSubText.textContent =
                "Here are your recent AI-generated career recommendations.";
        }

        dashboardHistory.forEach(item => {

            recommendationSection.innerHTML += `
                <div class="recommendation-card">
                    <div class="card-header">
                        <i data-lucide="file-text"></i>
                        <span class="card-type">LATEST</span>
                    </div>

                    <h3>Your Career Recommendations</h3>

                    <div class="card-meta">
                        <i data-lucide="calendar"></i>
                        <span>${item.date}</span>
                    </div>

                    <div class="card-stats">
                        <span>From ${item.source}</span>
                        <span>AI Generated</span>
                    </div>

                    <button class="view-btn"
                        onclick="window.location.href='recommendations.html'">
                        View Details
                    </button>
                </div>
            `;
        });

        if (typeof lucide !== "undefined") {
            lucide.createIcons();
        }
    }

    /* =========================
       START NEW ASSESSMENT
    ========================== */

    if (startBtn) {
        startBtn.addEventListener("click", function () {
            window.location.href = "assessment.html";
        });
    }

    /* =========================
       LOGOUT
    ========================== */

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {

            sessionStorage.removeItem("isLoggedIn");
            sessionStorage.removeItem("currentUser");
            sessionStorage.removeItem("careerProfile");
            sessionStorage.removeItem("recommendationSource");

            window.location.href = "index.html";
        });
    }

});
