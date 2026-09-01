import io
import re
import sys
import pdfplumber

nlp = None
try:
    import spacy

    try:
        nlp = spacy.load("en_core_web_sm")
    except OSError:
        try:
            import subprocess

            subprocess.run(
                [sys.executable, "-m", "spacy", "download", "en_core_web_sm"],
                capture_output=True,
            )
            nlp = spacy.load("en_core_web_sm")
        except Exception:
            try:
                nlp = spacy.blank("en")
            except Exception:
                nlp = None
except Exception:
    # On Windows systems with Application Control or missing visual C++ runtimes,
    # spaCy C-extensions may be restricted. We gracefully fall back to regex/heuristics.
    nlp = None

from ml_pipeline.synthetic_data import SKILLS_DB

_roberta_ner_pipeline = None


def get_roberta_pipeline():
    global _roberta_ner_pipeline
    if _roberta_ner_pipeline is None:
        try:
            from transformers import pipeline

            _roberta_ner_pipeline = pipeline(
                "ner",
                model="Jean-Baptiste/roberta-large-ner-english",
                aggregation_strategy="simple",
            )
        except Exception:
            _roberta_ner_pipeline = False
    return _roberta_ner_pipeline


def extract_skills(text: str) -> list[str]:
    """
    Extracts skills using word-boundary matching over modern skills taxonomy + fuzzy normalization.
    """
    text_processed = text.replace(".", " ").replace("/", " ").replace("-", " ")
    text_lower = text_processed.lower()
    found_skills = set()

    for skill in SKILLS_DB:
        skill_clean = skill.lower().replace(".", " ").replace("-", " ")
        pattern = r"\b" + re.escape(skill_clean) + r"\b"
        if re.search(pattern, text_lower):
            found_skills.add(skill)
        elif skill.lower() in text_lower and len(skill) > 3:
            found_skills.add(skill)

    ner_pipe = get_roberta_pipeline()
    if ner_pipe:
        try:
            truncated_text = text[:2000]
            ner_results = ner_pipe(truncated_text)
            for entity in ner_results:
                if entity.get("entity_group") in ["MISC", "ORG", "SKILL"]:
                    extracted_word = entity.get("word", "").strip()
                    if len(extracted_word) > 2 and extracted_word.lower() not in [
                        s.lower() for s in found_skills
                    ]:
                        found_skills.add(extracted_word)
        except Exception:
            pass

    return sorted(list(found_skills))


def extract_entities(text: str) -> dict[str, list[str]]:
    entities = {"ORG": [], "PERSON": [], "GPE": []}

    if nlp is not None:
        try:
            doc = nlp(text[:10000])
            for ent in doc.ents:
                if ent.label_ in entities:
                    if ent.text not in entities[ent.label_]:
                        entities[ent.label_].append(ent.text)
            return entities
        except Exception:
            pass

    # Heuristic / regex entity extraction fallback
    org_pattern = r"\b([A-Z][a-zA-Z0-9&]+(?:\s+(?:Inc|LLC|Corp|Corporation|Technologies|Systems|Labs|University|College|Institute|Solutions))?)\b"
    org_matches = re.findall(org_pattern, text[:5000])
    entities["ORG"] = list(dict.fromkeys([o for o in org_matches if len(o) > 3]))[:6]

    gpe_pattern = r"\b(San Francisco|New York|London|Bangalore|Berlin|Seattle|Austin|Toronto|Singapore|Tokyo|Chicago|Boston|India|USA|UK|Canada|Germany)\b"
    gpe_matches = re.findall(gpe_pattern, text, re.IGNORECASE)
    entities["GPE"] = list(dict.fromkeys(gpe_matches))[:4]

    return entities


def extract_quantifiable_metrics(text: str) -> list[str]:
    """Finds quantified accomplishments like 'improved by 45%', '$2.5M revenue', 'scaled to 100k users'"""
    patterns = [
        r"(?:improved|increased|decreased|reduced|boosted|scaled|generated|saved)\s+[^.\n]{1,60}?\b(?:\d+(?:\.\d+)?%|\$\d+(?:\.\d+)?[kKmMbB]?|\d+x|\d+(?:,\d+)?\s*(?:users|requests|qps|events))\b",
        r"\b(?:\d+(?:\.\d+)?%|\$\d+(?:\.\d+)?[kKmMbB]?|\d+x)\s+[^.\n]{1,50}",
    ]
    matches = []
    for pat in patterns:
        found = re.findall(pat, text, flags=re.IGNORECASE)
        matches.extend([m.strip() for m in found if len(m.strip()) > 5])
    return list(dict.fromkeys(matches))[:8]


def extract_sections(text: str) -> dict[str, bool]:
    """Detects essential ATS sections"""
    text_lower = text.lower()
    return {
        "contact_info": bool(re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+|\+?\d{10,14}", text)),
        "experience": bool(
            re.search(r"\b(experience|employment|work history|career)\b", text_lower)
        ),
        "education": bool(
            re.search(
                r"\b(education|university|college|degree|bachelor|master|b\.tech|m\.tech|b\.s|m\.s)\b",
                text_lower,
            )
        ),
        "projects": bool(
            re.search(
                r"\b(projects|portfolio|personal projects|open source)\b", text_lower
            )
        ),
        "skills": bool(
            re.search(
                r"\b(skills|technical competencies|technologies|proficiencies)\b",
                text_lower,
            )
        ),
        "certifications": bool(
            re.search(
                r"\b(certifications|certificates|licenses|credentials|awards)\b",
                text_lower,
            )
        ),
    }


def extract_text_from_pdf(file_bytes: bytes) -> str:
    text = ""
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text


def parse_cv_text(text: str) -> dict[str, any]:
    skills = extract_skills(text)
    entities = extract_entities(text)
    sections = extract_sections(text)
    metrics = extract_quantifiable_metrics(text)

    words = re.findall(r"\b\w+\b", text[:8000])
    word_count = len(words)

    return {
        "skills": skills,
        "organizations": entities["ORG"],
        "persons": entities["PERSON"],
        "locations": entities["GPE"],
        "word_count": word_count,
        "sections": sections,
        "quantifiable_metrics": metrics,
        "raw_text": text,
    }
