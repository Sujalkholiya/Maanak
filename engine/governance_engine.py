import json, os
from pathlib import Path
DATASET = Path("Resources[Dataset]")
class GovernanceEngine:
    def inspect(self, p):
        v=[]; pa=[]; rev=[]
        if p.get("country_of_origin") is None and not p.get("is_imported"):
            rev.append("country_of_origin null")
        if p.get("batch_no") is None:
            v.append({"field":"batch_no","severity":"CRITICAL","rule_id":"INT_PCR_BATCH_TRACEABILITY","expected_condition":"Batch required"})
        if p.get("net_quantity") and isinstance(p.get("net_quantity"),str) and p.get("net_quantity").isdigit():
            v.append({"field":"net_quantity","severity":"HIGH","rule_id":"INT_PCR_GENERIC_NAME","expected_condition":"Unit required"})
        status = "NON_COMPLIANT" if v else ("REVIEW_REQUIRED" if rev else "COMPLIANT")
        return {"inspection_id":p.get("inspection_id","INS-UNKNOWN"),"status":status,"confidence":0.85 if v else 0.55,"ai_status":"UNAVAILABLE","violations":v,"passed_checks":pa,"review_required":rev,"timestamp":"2026-09-09T00:00:00Z"}
