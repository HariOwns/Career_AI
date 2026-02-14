🚀 CareerAI – AI-Based Career Recommendation System

CareerAI is a frontend-based intelligent career recommendation system that generates personalized career suggestions using either:
📋 Questionnaire-based assessment
📄 Resume upload with AI keyword extraction
The system analyzes user skills, interests, experience level, work style, and industry preferences to generate smart career recommendations using a structured scoring engine.

🌟 Features
🔐 User Authentication
Session-based login system
Personalized dashboard
Dynamic welcome message

📋 Questionnaire-Based Career Assessment
Collects:
Skills
Interests
Preferred industries
Experience level
Work style (Remote/Hybrid/On-site)
Freelance preference
Generates AI-based ranked career matches

📄 Resume Upload (PDF / DOCX / TXT)
Extracts resume text using:
pdf.js
mammoth.js

Detects:
Skills
Industries
Years of experience
Freelance keywords
Work style indicators
Uses same scoring engine as questionnaire
🧠 Intelligent Scoring Engine

Weighted scoring logic:
Skill match
Industry alignment
Experience match
Work style compatibility
Freelance preference
Trending career boost
📊 Dynamic Dashboard
Displays recommendation history

Shows source:
From Questionnaire
From Resume
Stores history using localStorage
Supports multiple recommendation entries

📄 PDF Export
Download recommendations as PDF
Clean formatted output

🏗️ Tech Stack
HTML5
CSS3
JavaScript (Vanilla JS)
pdf.js (PDF parsing)
mammoth.js (DOCX parsing)
Lucide Icons
LocalStorage / SessionStorage
GitHub Pages (Hosting)


📂 Project Structure
Career-AI/
│
├── index.html
├── assessment.html
├── upload.html
├── dashboard.html
├── recommendations.html
│
├── js/
│   ├── script.js
│   ├── assessment.js
│   ├── upload.js
│   ├── dashboard.js
│   ├── recommendations.js
│   └── engine.js
│
├── css/
│   └── stylesheets
│
├── data/
│   └── career_roles.json

⚙️ How It Works
1️⃣ Questionnaire Flow
User → Assessment → Profile Built → Engine Scoring → Recommendations → Saved to Dashboard

2️⃣ Resume Flow
User → Upload Resume → Text Extraction → Profile Built → Engine Scoring → Recommendations → Saved to Dashboard

Both flows use the same engine logic for consistency.

🧠 Scoring Logic Overview
Each career role in career_roles.json is evaluated based on:
Factor	Weight
Skill Match	High
Industry Match	Medium
Experience Match	Medium
Work Style	Medium
Freelance Preference	Low
Trending Boost	Bonus

Final results are sorted by match percentage.
