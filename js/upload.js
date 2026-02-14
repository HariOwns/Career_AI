document.addEventListener("DOMContentLoaded", function () {

    const dropArea = document.getElementById("dropArea");
    const browseBtn = document.getElementById("browseBtn");
    const fileInput = document.getElementById("fileInput");
    const uploadBtn = document.getElementById("uploadBtn");
    const dropTitle = document.getElementById("dropTitle");

    let selectedFile = null;

    /* =========================
       FILE SELECTION
    ========================== */

    browseBtn.addEventListener("click", () => fileInput.click());
    dropArea.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", function () {
        handleFile(this.files[0]);
    });

    dropArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropArea.classList.add("active");
    });

    dropArea.addEventListener("dragleave", () => {
        dropArea.classList.remove("active");
    });

    dropArea.addEventListener("drop", (e) => {
        e.preventDefault();
        dropArea.classList.remove("active");
        handleFile(e.dataTransfer.files[0]);
    });

    function handleFile(file) {
        if (!file) return;

        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain"
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Unsupported file type.");
            return;
        }

        selectedFile = file;
        dropTitle.textContent = file.name;
        uploadBtn.classList.remove("disabled");
        uploadBtn.disabled = false;
    }

    /* =========================
       RESUME TEXT EXTRACTION
    ========================== */

    async function extractText(file) {

        // PDF
        if (file.type === "application/pdf") {

            const buffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

            let text = "";

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                text += content.items.map(item => item.str).join(" ");
            }

            return text;
        }

        // DOCX
        if (file.type.includes("word")) {
            const buffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer: buffer });
            return result.value;
        }

        // TXT
        if (file.type === "text/plain") {
            return await file.text();
        }

        return "";
    }

    /* =========================
       BUILD PROFILE
    ========================== */

    async function buildProfile(file) {

        const text = await extractText(file);
        const lowerText = text.toLowerCase();

        const res = await fetch("data/career_roles.json");
        const rolesData = await res.json();

        let skills = [];
        let industries = [];
        let experience = "Fresher";
        let freelance = false;
        let workStyle = "Hybrid";

        /* =========================
           EXTRACT SKILLS
        ========================== */

        for (let roleName in rolesData) {

            const role = rolesData[roleName];

            role.skills.forEach(skill => {
                if (lowerText.includes(skill.toLowerCase())) {
                    if (!skills.includes(skill)) {
                        skills.push(skill);
                    }
                }
            });

            if (lowerText.includes(role.category.toLowerCase())) {
                if (!industries.includes(role.category)) {
                    industries.push(role.category);
                }
            }
        }

        /* =========================
           EXPERIENCE DETECTION
        ========================== */

        const yearMatch = lowerText.match(/\b([0-9]+)\s+years?\b/);

        if (yearMatch) {
            const years = parseInt(yearMatch[1]);

            if (years >= 10) experience = "10+";
            else if (years >= 5) experience = "5+";
            else if (years >= 3) experience = "3+";
            else if (years >= 2) experience = "2+";
            else if (years >= 1) experience = "1+";
        }

        /* =========================
           FREELANCE DETECTION
        ========================== */

        if (lowerText.includes("freelance") ||
            lowerText.includes("self employed")) {
            freelance = true;
        }

        /* =========================
           WORK STYLE DETECTION
        ========================== */

        if (lowerText.includes("remote")) {
            workStyle = "Remote";
        }

        if (lowerText.includes("on-site") ||
            lowerText.includes("onsite")) {
            workStyle = "On-site";
        }

        return {
            skills: skills,
            industries: industries,
            experience: experience,
            freelance: freelance,
            workStyle: workStyle
        };
    }

    /* =========================
       GENERATE BUTTON
    ========================== */

    uploadBtn.addEventListener("click", function () {

        if (!selectedFile) return;

        const overlay = document.getElementById("loadingOverlay");
        const timerText = document.getElementById("loadingTimer");
        const statusText = document.getElementById("loadingStatus");
        const iconContainer = document.getElementById("loadingIcon");

        overlay.style.display = "flex";

        const stages = [
            { text: "Parsing Resume...", icon: "file-text" },
            { text: "Extracting Skills...", icon: "cpu" },
            { text: "Matching Roles...", icon: "briefcase" },
            { text: "Ranking Careers...", icon: "trending-up" },
            { text: "Finalizing AI Results...", icon: "sparkles" }
        ];

        const totalTime = Math.floor(Math.random() * 6) + 6;
        let remaining = totalTime;

        function updateStage(progress) {

            let index;

            if (progress < 20) index = 0;
            else if (progress < 40) index = 1;
            else if (progress < 65) index = 2;
            else if (progress < 85) index = 3;
            else index = 4;

            statusText.textContent = stages[index].text;

            iconContainer.innerHTML =
                `<i data-lucide="${stages[index].icon}"></i>`;

            lucide.createIcons();
        }

        updateStage(0);
        timerText.textContent = `Redirecting in ${remaining}s`;

        const interval = setInterval(() => {

            remaining--;

            const progress =
                ((totalTime - remaining) / totalTime) * 100;

            updateStage(progress);
            timerText.textContent = `Redirecting in ${remaining}s`;

            if (remaining <= 0) {

                clearInterval(interval);

                buildProfile(selectedFile)
                    .then(profile => {

                        sessionStorage.setItem(
                            "careerProfile",
                            JSON.stringify(profile)
                        );

                        sessionStorage.setItem(
                            "recommendationSource",
                            "Resume"
                        );

                        window.location.href = "recommendations.html";
                    })
                    .catch(err => {
                        console.error("Parsing failed:", err);
                        alert("Resume parsing failed. Check console.");
                    });
            }

        }, 1000);
    });

    /* =========================
       BACK BUTTON
    ========================= */

    const backBtn = document.getElementById("backBtn");

    if (backBtn) {
        backBtn.addEventListener("click", function () {
            window.location.href = "index.html";
        });
    }    

});
