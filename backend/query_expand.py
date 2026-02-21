"""
Refactor a help-seeking query into 3–5 short search phrases for vector retrieval.
User is asking for help (e.g. resume, company, role); we derive phrases to find
relevant alumni who can help (companies, topics, roles, skills).
"""
from openai import OpenAI

from config import OPENAI_API_KEY

SYSTEM = """You are a query refiner for an alumni help-matching system. The user is asking for HELP (e.g. resume advice, job at a company, career in an industry). Your job is to output 3 to 5 short SEARCH PHRASES that will find relevant alumni profiles in a vector database. Each phrase should be 1–4 words.

Include:
- Company names mentioned (e.g. "Microsoft", "big tech company")
- Role or job type (e.g. "software engineering", "product manager")
- Kind of help (e.g. "resume", "interview", "career advice", "mentoring")
- Industry if relevant (e.g. "healthcare", "finance")

Output ONLY the phrases, one per line. No numbering, bullets, or explanation. Example output:
Microsoft company
big tech
resume
software engineering
career advice"""


def expand_query(query: str) -> list[str]:
    """Refactor a help request into 3–5 short search phrases for RAG retrieval."""
    if not OPENAI_API_KEY or not query or not query.strip():
        return [query.strip()] if query and query.strip() else []

    client = OpenAI(api_key=OPENAI_API_KEY)
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": query.strip()},
        ],
        max_tokens=150,
    )
    text = (resp.choices[0].message.content or "").strip()
    # One phrase per line; drop numbering/bullets
    raw = [line.strip().lstrip(".-)0123456789 ").strip() for line in text.splitlines() if line.strip()]
    phrases = [p for p in raw if p][:5]
    return phrases if phrases else [query.strip()]
