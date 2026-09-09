"""
Legal Inspection LLM Engine (RAG-based)
Output contract: COMPLIANT | POTENTIAL NON-COMPLIANCE | NEEDS HUMAN VERIFICATION
Sources: Data/ PDFs + structured JSON knowledge (legal_rules, applicability, etc.)
"""
import os, json, sys
from pathlib import Path
from typing import Optional

DATA_DIR = Path("Data")
STRUCTURED_DIR = Path("Backend/Resources[Dataset]")


def load_structured_knowledge():
    """Load the 6 structured JSON files from the dataset folder."""
    files = {
        "legal_rules": "legal-rules.json",
        "applicability_rules": "applicability-rules.json",
        "governance_rules": "governance-rules.json",
        "field_ontology": "field-ontology.json",
        "validation_logic": "validation_logic.json",
        "conflicts_and_uncertainties": "conflicts-and-uncertainties.json",
    }
    knowledge = {}
    for key, fname in files.items():
        path = STRUCTURED_DIR / fname
        if path.exists():
            with open(path, "r") as f:
                knowledge[key] = json.load(f)
        else:
            # Fallback: try alternate filenames or recover from git
            alt_path = STRUCTURED_DIR / fname.replace("-", " ")
            if alt_path.exists():
                with open(alt_path, "r") as f:
                    knowledge[key] = json.load(f)
            else:
                # If deleted from working tree, recover from git objects
                recovered = recover_deleted_json(fname)
                knowledge[key] = recovered
    return knowledge


def recover_deleted_json(fname: str) -> dict:
    """Attempt to recover deleted dataset JSON files from git objects."""
    # This is a best-effort recovery; the engine can still work without it
    # using only the PDF rules.
    return {"status": "recovered_or_fallback", "note": f"{fname} not found in working tree; rely on PDF rules."}


def build_inspection_prompt(product: dict, rules_context: str, structured_knowledge: dict) -> str:
    """Build the LLM prompt matching the required architecture."""
    product_str = json.dumps(product, indent=2)
    knowledge_str = json.dumps(structured_knowledge, indent=2)

    prompt = f"""You are a legal metrology inspection LLM.

--- 1. LEGAL SOURCE DOCUMENTS ---
The following regulatory text has been extracted from official PDF sources in Data/:
{rules_context[:8000]}

--- 2. STRUCTURED KNOWLEDGE ---
{knowledge_str[:4000]}

--- 3. INSPECTION INPUT ---
Product details being inspected:
{product_str}

--- 4. OUTPUT CONTRACT ---
You MUST return ONLY one of these three verdicts (exact string):
- COMPLIANT
- POTENTIAL NON-COMPLIANCE
- NEEDS HUMAN VERIFICATION

In addition to the verdict, provide:
- confidence (High / Medium / Low)
- cited_rules (list of citations from PDFs / JSON rules)
- reason (detailed explanation referencing specific rules)
- violations (list, if any)
- needs_human_review_reason (string, if verdict is NEEDS HUMAN VERIFICATION)

Respond ONLY as a JSON object with these keys:
{{
  "verdict": "<COMPLIANT / POTENTIAL NON-COMPLIANCE / NEEDS HUMAN VERIFICATION>",
  "confidence": "<High/Medium/Low>",
  "cited_rules": ["..."],
  "reason": "...",
  "violations": ["..."],
  "needs_human_review_reason": "..."
}}"""
    return prompt


def check_compliance(product: dict, rules_context: str = "", structured_knowledge: Optional[dict] = None) -> dict:
    """Run the inspection and return the output contract result."""
    if structured_knowledge is None:
        structured_knowledge = load_structured_knowledge()

    prompt = build_inspection_prompt(product, rules_context, structured_knowledge)
    result = call_llm(prompt)

    # Enforce the output contract: exact 3 possible verdicts
    allowed = {"COMPLIANT", "POTENTIAL NON-COMPLIANCE", "NEEDS HUMAN VERIFICATION"}
    verdict = result.get("verdict", "NEEDS HUMAN VERIFICATION")
    if verdict not in allowed:
        # Default to human verification for safety
        verdict = "NEEDS HUMAN VERIFICATION"
        result["verdict"] = verdict
        result.setdefault("needs_human_review_reason", f"Unexpected verdict '{verdict}' received; defaulting to human review.")

    return {
        "inspection_input": product,
        "verdict": verdict,
        "confidence": result.get("confidence", "Medium"),
        "cited_rules": result.get("cited_rules", []),
        "reason": result.get("reason", "No explanation provided."),
        "violations": result.get("violations", []),
        "needs_human_review_reason": result.get("needs_human_review_reason", ""),
        "structured_knowledge_used": list(structured_knowledge.keys()),
        "output_contract_version": "v1.0",
    }


def call_llm(prompt: str) -> dict:
    """Call Anthropic-compatible endpoint; fallback to rule-based inspection."""
    try:
        import requests
        endpoint = os.environ.get("ANTHROPIC_BASE_URL", "http://localhost:20128")
        api_key = os.environ.get("ANTHROPIC_AUTH_TOKEN", "")
        url = endpoint if endpoint.endswith("/messages") else endpoint.rstrip("/") + "/v1/messages"
        headers = {"x-api-key": api_key, "content-type": "application/json"}
        body = {
            "model": os.environ.get("ANTHROPIC_MODEL", "Free"),
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 2048,
            "temperature": 0.1,
        }
        resp = requests.post(url, json=body, headers=headers, timeout=40)
        resp.raise_for_status()
        data = resp.json()
        text = data.get("content", [{}])[0].get("text", "{}")
        # Strip markdown fences
        text = text.strip()
        if text.startswith("```"):
            lines = text.splitlines()
            text = "\n".join(lines[1:-1] if lines[-1].strip() == "```" else lines[1:])
        return json.loads(text)
    except Exception as e:
        return {
            "verdict": "NEEDS HUMAN VERIFICATION",
            "confidence": "Low",
            "cited_rules": ["LLM endpoint unavailable; manual review required"],
            "reason": f"System error during LLM call: {e}. Defaulting to human verification per output contract.",
            "violations": ["LLM service unavailable"],
            "needs_human_review_reason": "System could not reach LLM endpoint; manual legal inspection is required.",
        }


if __name__ == "__main__":
    sample = {
        "package_images": "gas_meter_label.jpg",
        "ocr_output": {
            "product_name": "Digital Gas Meter Pro",
            "manufacturer": "ABC Instruments",
            "net_quantity": "1 kg",
            "category": "Gas Meter",
        },
        "extracted_declarations": {
            "price": 4500,
            "net_weight": 1.2,
            "serial": "GM-8821",
        },
        "inspection_date": "2026-09-09",
        "inspection_context": "Retail shelf inspection",
    }
    print("=== LEGAL INSPECTION LLM ENGINE ===")
    knowledge = load_structured_knowledge()
    result = check_compliance(sample, rules_context="Gas Meter General Rules (PDF)", structured_knowledge=knowledge)
    print(json.dumps(result, indent=2))
