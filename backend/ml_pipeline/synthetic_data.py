import os
import random
import numpy as np
import pandas as pd

# Comprehensive modern tech skills database (100+ high-demand skills)
SKILLS_DB = [
    # Languages
    "Python",
    "Java",
    "C++",
    "C#",
    "Go",
    "Rust",
    "TypeScript",
    "JavaScript",
    "Swift",
    "Kotlin",
    "Ruby",
    "PHP",
    "SQL",
    "R",
    # Frontend & Fullstack
    "React",
    "Next.js",
    "Vue.js",
    "Angular",
    "Svelte",
    "Node.js",
    "Express.js",
    "FastAPI",
    "Django",
    "Flask",
    "Spring Boot",
    "ASP.NET",
    "GraphQL",
    "Tailwind CSS",
    "Redux",
    "WebSockets",
    # Databases & Storage
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Redis",
    "Cassandra",
    "Elasticsearch",
    "Neo4j",
    "DynamoDB",
    "Supabase",
    "Prisma",
    # Cloud & DevOps
    "AWS",
    "GCP",
    "Azure",
    "Docker",
    "Kubernetes",
    "Terraform",
    "CI/CD",
    "GitHub Actions",
    "Jenkins",
    "Ansible",
    "Prometheus",
    "Grafana",
    "Linux",
    "Microservices",
    "Serverless",
    # AI / Machine Learning / GenAI
    "Machine Learning",
    "Deep Learning",
    "NLP",
    "Computer Vision",
    "TensorFlow",
    "PyTorch",
    "Scikit-Learn",
    "Hugging Face",
    "Transformers",
    "LLMs",
    "LangChain",
    "RAG",
    "Vector Databases",
    "Prompt Engineering",
    "OpenCV",
    "Fine-Tuning",
    # Data Engineering & Analytics
    "Pandas",
    "NumPy",
    "Apache Spark",
    "Kafka",
    "Airflow",
    "Snowflake",
    "Databricks",
    "Tableau",
    "Power BI",
    "Data Modeling",
    "ETL",
    "Big Data",
    # System Design & Architecture
    "Data Structures",
    "Algorithms",
    "System Design",
    "Distributed Systems",
    "Design Patterns",
    "Object-Oriented Programming",
    "REST APIs",
    "gRPC",
    "Event-Driven Architecture",
    # Cybersecurity & Quality
    "Cybersecurity",
    "Penetration Testing",
    "OAuth",
    "JWT",
    "Unit Testing",
    "Jest",
    "Pytest",
    "Cypress",
    "Appium",
    # Soft & Leadership Skills
    "Agile",
    "Scrum",
    "Leadership",
    "Problem Solving",
    "Team Collaboration",
    "Communication",
    "Product Management",
    "Critical Thinking",
]

COMPANIES = [
    "Google",
    "Amazon",
    "Microsoft",
    "Meta",
    "Apple",
    "Netflix",
    "Nvidia",
    "OpenAI",
    "Stripe",
    "Uber",
    "Adobe",
    "Salesforce",
    "Oracle",
    "IBM",
    "Infosys",
    "TCS",
    "Wipro",
    "Accenture",
]

# Company hiring criteria & required competencies
COMPANY_REQUIREMENTS = {
    "Google": {
        "min_cgpa": 8.5,
        "min_exp": 0,
        "required_skills": [
            "Algorithms",
            "Data Structures",
            "System Design",
            "Python",
            "C++",
            "Distributed Systems",
            "Machine Learning",
        ],
    },
    "Amazon": {
        "min_cgpa": 8.0,
        "min_exp": 0,
        "required_skills": [
            "Java",
            "AWS",
            "SQL",
            "System Design",
            "Leadership",
            "Microservices",
            "Data Structures",
        ],
    },
    "Microsoft": {
        "min_cgpa": 8.0,
        "min_exp": 0,
        "required_skills": [
            "C#",
            "C++",
            "Azure",
            "Cloud",
            "Distributed Systems",
            "TypeScript",
            "System Design",
        ],
    },
    "Meta": {
        "min_cgpa": 8.2,
        "min_exp": 0,
        "required_skills": [
            "React",
            "JavaScript",
            "TypeScript",
            "Python",
            "System Design",
            "Algorithms",
            "GraphQL",
        ],
    },
    "Apple": {
        "min_cgpa": 8.5,
        "min_exp": 0,
        "required_skills": [
            "Swift",
            "C++",
            "Python",
            "Data Structures",
            "Operating Systems",
            "Problem Solving",
        ],
    },
    "Netflix": {
        "min_cgpa": 8.0,
        "min_exp": 1,
        "required_skills": [
            "Java",
            "Python",
            "AWS",
            "Microservices",
            "Distributed Systems",
            "Kafka",
            "System Design",
        ],
    },
    "Nvidia": {
        "min_cgpa": 8.5,
        "min_exp": 0,
        "required_skills": [
            "C++",
            "PyTorch",
            "Deep Learning",
            "Computer Vision",
            "CUDA",
            "Algorithms",
            "Python",
        ],
    },
    "OpenAI": {
        "min_cgpa": 8.8,
        "min_exp": 1,
        "required_skills": [
            "Python",
            "PyTorch",
            "LLMs",
            "Deep Learning",
            "Transformers",
            "Distributed Systems",
            "Algorithms",
        ],
    },
    "Stripe": {
        "min_cgpa": 8.2,
        "min_exp": 0,
        "required_skills": [
            "Ruby",
            "Go",
            "TypeScript",
            "System Design",
            "API Design",
            "Distributed Systems",
            "PostgreSQL",
        ],
    },
    "Uber": {
        "min_cgpa": 8.0,
        "min_exp": 0,
        "required_skills": [
            "Go",
            "Java",
            "Microservices",
            "Kafka",
            "System Design",
            "Algorithms",
            "Redis",
        ],
    },
    "Adobe": {
        "min_cgpa": 8.0,
        "min_exp": 0,
        "required_skills": [
            "C++",
            "JavaScript",
            "React",
            "Algorithms",
            "UI/UX",
            "Python",
        ],
    },
    "Salesforce": {
        "min_cgpa": 7.8,
        "min_exp": 0,
        "required_skills": [
            "Java",
            "Cloud",
            "REST APIs",
            "SQL",
            "TypeScript",
            "System Design",
        ],
    },
    "Oracle": {
        "min_cgpa": 7.5,
        "min_exp": 0,
        "required_skills": [
            "Java",
            "SQL",
            "Database Design",
            "Cloud",
            "Linux",
            "Data Structures",
        ],
    },
    "IBM": {
        "min_cgpa": 7.2,
        "min_exp": 0,
        "required_skills": [
            "Python",
            "Machine Learning",
            "Cloud",
            "Data Science",
            "Linux",
            "Java",
        ],
    },
    "Infosys": {
        "min_cgpa": 6.5,
        "min_exp": 0,
        "required_skills": [
            "Java",
            "SQL",
            "Web Development",
            "Communication",
            "Python",
        ],
    },
    "TCS": {
        "min_cgpa": 6.5,
        "min_exp": 0,
        "required_skills": [
            "Java",
            "JavaScript",
            "SQL",
            "Team Collaboration",
            "Problem Solving",
        ],
    },
    "Wipro": {
        "min_cgpa": 6.5,
        "min_exp": 0,
        "required_skills": ["Java", "Python", "SQL", "Cloud", "Communication"],
    },
    "Accenture": {
        "min_cgpa": 6.8,
        "min_exp": 0,
        "required_skills": ["Java", "Cloud", "SQL", "Agile", "Problem Solving"],
    },
}


def generate_synthetic_data(num_samples=25000):
    """
    Generates a rich, balanced synthetic CV dataset with realistic multi-factor distributions
    including CGPA, target company, skills match %, project score, and placement status.
    """
    data = []
    np.random.seed(42)
    random.seed(42)

    for _ in range(num_samples):
        company = random.choice(COMPANIES)
        req_info = COMPANY_REQUIREMENTS.get(company, {})
        req_skills = req_info.get("required_skills", ["Python", "Java", "SQL"])
        min_cgpa = req_info.get("min_cgpa", 7.0)

        # Diverse candidate profiles (fresher, experienced, high-achiever, standard)
        candidate_tier = random.choices(
            ["high", "mid", "low"], weights=[0.35, 0.45, 0.20]
        )[0]

        if candidate_tier == "high":
            cgpa = round(np.random.normal(8.8, 0.6), 1)
            num_skills = random.randint(8, 16)
            # Pick almost all target company skills + modern stack
            matched_count = random.randint(max(1, len(req_skills) - 2), len(req_skills))
            picked_req = random.sample(req_skills, min(matched_count, len(req_skills)))
            extra_skills = random.sample(
                SKILLS_DB, max(0, num_skills - len(picked_req))
            )
            candidate_skills = list(set(picked_req + extra_skills))
            project_score = random.uniform(80, 100)
        elif candidate_tier == "mid":
            cgpa = round(np.random.normal(7.4, 0.8), 1)
            num_skills = random.randint(5, 10)
            matched_count = random.randint(1, max(1, len(req_skills) // 2 + 1))
            picked_req = random.sample(req_skills, min(matched_count, len(req_skills)))
            extra_skills = random.sample(
                SKILLS_DB, max(0, num_skills - len(picked_req))
            )
            candidate_skills = list(set(picked_req + extra_skills))
            project_score = random.uniform(50, 80)
        else:
            cgpa = round(np.random.normal(6.2, 0.7), 1)
            num_skills = random.randint(2, 6)
            candidate_skills = random.sample(SKILLS_DB, num_skills)
            project_score = random.uniform(20, 55)

        cgpa = max(5.0, min(10.0, cgpa))

        # Calculate exact skill match percentage
        matched = set(candidate_skills).intersection(req_skills)
        skill_match_pct = (len(matched) / len(req_skills)) * 100

        # Multi-factor probability scoring
        cgpa_factor = max(0.0, min(1.0, (cgpa - 5.0) / 5.0))
        skill_factor = skill_match_pct / 100.0
        project_factor = project_score / 100.0

        # Weighted calculation based on company selectivity
        if min_cgpa >= 8.5:  # Tier 1 Elite (Google, OpenAI, Nvidia, Apple)
            raw_score = (
                (cgpa_factor * 0.30) + (skill_factor * 0.50) + (project_factor * 0.20)
            )
            if cgpa < min_cgpa:
                raw_score *= 0.65
        elif min_cgpa >= 7.5:  # Tier 2 Top Product / Cloud
            raw_score = (
                (cgpa_factor * 0.30) + (skill_factor * 0.45) + (project_factor * 0.25)
            )
            if cgpa < (min_cgpa - 0.4):
                raw_score *= 0.75
        else:  # Service / Enterprise
            raw_score = (
                (cgpa_factor * 0.35) + (skill_factor * 0.40) + (project_factor * 0.25)
            )

        probability = raw_score * 100.0 + random.uniform(-4, 4)
        probability = round(max(5.0, min(99.0, probability)), 1)

        if probability >= 72.0:
            status = "High Chance"
        elif probability >= 45.0:
            status = "Medium Chance"
        else:
            status = "Low Chance"

        data.append(
            {
                "CGPA": cgpa,
                "TargetCompany": company,
                "Skills": ", ".join(candidate_skills),
                "SkillMatchPct": round(skill_match_pct, 2),
                "PlacementProbability": probability,
                "PlacementStatus": status,
            }
        )

    df = pd.DataFrame(data)
    csv_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "synthetic_cv_dataset.csv"
    )
    df.to_csv(csv_path, index=False)
    print(f"Generated {num_samples} records and saved to {csv_path}")
    return df


if __name__ == "__main__":
    generate_synthetic_data(25000)
