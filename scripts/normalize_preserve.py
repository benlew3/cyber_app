#!/usr/bin/env python3
"""
PRESERVATION-FIRST JSON Normalization Script

This script PRESERVES all existing content while normalizing structure:
1. Converts why_it_matters STRING → OBJECT (preserving the string content)
2. Converts skill_tree STRING arrays → OBJECT arrays (looking up titles)
3. Adds subtitle ONLY if missing
4. Adds connection_to_next ONLY if missing
5. Normalizes memory_hooks keys (singular → plural)

DOES NOT:
- Add new content (hands_on_activity, what_would_you_do)
- Overwrite existing content
- Remove any fields
"""

import json
import os
from copy import deepcopy

# Lesson titles lookup for converting string IDs to objects
LESSON_TITLES = {
    "D1-LESSON-001": "Security Controls Fundamentals",
    "D1-LESSON-002": "CIA Triad Fundamentals",
    "D1-LESSON-003": "Authentication Methods",
    "D1-LESSON-004": "Cryptographic Fundamentals",
    "D1-LESSON-005": "Zero Trust Architecture",
    "D1-LESSON-006": "Physical Security Controls",
    "D1-LESSON-007": "Deception Technologies",
    "D1-LESSON-008": "Change Management",
    "D2-LESSON-001": "Threat Actors & Motivations",
    "D2-LESSON-002": "Threat Vectors & Attack Surfaces",
    "D2-LESSON-003": "Social Engineering",
    "D2-LESSON-004": "Malware Types",
    "D2-LESSON-005": "Network Attacks",
    "D2-LESSON-006": "Application Attacks",
    "D2-LESSON-007": "Vulnerability Management",
    "D2-LESSON-008": "Indicators of Compromise",
    "D2-LESSON-009": "Hardening & Configurations",
    "D2-LESSON-010": "Mitigation Techniques",
    "D2-LESSON-011": "Attack Frameworks",
    "D2-LESSON-012": "Security Assessments",
    "D3-LESSON-001": "Security Architecture Concepts",
    "D3-LESSON-002": "Infrastructure Security",
    "D3-LESSON-003": "Network Security",
    "D3-LESSON-004": "Wireless Security",
    "D3-LESSON-005": "Cloud Security",
    "D3-LESSON-006": "Cryptography",
    "D3-LESSON-007": "Resilience & Recovery",
    "D3-LESSON-008": "Data Protection",
    "D4-LESSON-001": "Security Monitoring",
    "D4-LESSON-002": "Incident Response",
    "D4-LESSON-003": "Digital Forensics",
    "D4-LESSON-004": "Vulnerability Management",
    "D4-LESSON-005": "Identity & Access Management",
    "D4-LESSON-006": "Data Protection",
    "D4-LESSON-007": "Security Automation",
    "D5-LESSON-001": "Security Governance",
    "D5-LESSON-002": "Risk Management",
    "D5-LESSON-003": "Third-Party Risk Management",
    "D5-LESSON-004": "Security Compliance",
    "D5-LESSON-005": "Audits & Assessments",
    "D5-LESSON-006": "Security Awareness",
}

# Subtitles to add ONLY if missing
SUBTITLES = {
    "D3-LESSON-001": "Building Security from the Ground Up",
    "D3-LESSON-002": "Securing Networks, Servers, and Endpoints",
    "D3-LESSON-003": "Protecting Data in Transit",
    "D3-LESSON-004": "Securing the Invisible Network",
    "D3-LESSON-005": "Security in Shared Responsibility Models",
    "D3-LESSON-006": "The Science of Secrets",
    "D3-LESSON-007": "Bouncing Back from Disasters",
    "D3-LESSON-008": "Protecting Information Assets",
    "D4-LESSON-001": "Eyes on the Network",
    "D4-LESSON-002": "When Things Go Wrong",
    "D4-LESSON-003": "Finding the Evidence",
    "D4-LESSON-004": "Finding and Fixing Weaknesses",
    "D4-LESSON-005": "Controlling Who Gets Access",
    "D4-LESSON-006": "Safeguarding Sensitive Information",
    "D4-LESSON-007": "Working Smarter with SOAR",
    "D5-LESSON-001": "Security Leadership and Strategy",
    "D5-LESSON-002": "Identifying and Managing Threats",
    "D5-LESSON-003": "Trusting Your Partners",
    "D5-LESSON-004": "Meeting Regulatory Requirements",
    "D5-LESSON-005": "Validating Security Controls",
    "D5-LESSON-006": "Building a Security Culture",
}

# Connection to next ONLY if missing
CONNECTIONS = {
    "D1-LESSON-006": "Physical security creates the first line of defense. The next lesson covers Deception Technologies - honeypots, honeynets, and other ways to mislead attackers.",
    "D1-LESSON-007": "Deception technologies help detect attackers. The next lesson covers Change Management - controlling how systems are modified to maintain security.",
    "D1-LESSON-008": "Domain 1 complete! You now understand general security concepts. Domain 2 covers Threats, Vulnerabilities & Mitigations - know your enemy.",
    "D2-LESSON-001": "Understanding threat actors helps predict attacks. The next lesson covers Threat Vectors - how attackers deliver their payloads.",
    "D2-LESSON-002": "Attack surfaces define exposure. The next lesson covers Social Engineering - manipulating humans rather than systems.",
    "D2-LESSON-003": "Social engineering targets people. The next lesson covers Malware Types - the malicious software attackers deploy.",
    "D2-LESSON-004": "Malware is the attacker's payload. The next lesson covers Network Attacks - how attackers exploit network protocols.",
    "D2-LESSON-005": "Network attacks target infrastructure. The next lesson covers Application Attacks - SQL injection, XSS, and more.",
    "D2-LESSON-006": "Application attacks exploit code flaws. The next lesson covers Vulnerability Management - finding weaknesses before attackers do.",
    "D2-LESSON-007": "Vulnerability management is proactive defense. The next lesson covers Indicators of Compromise - detecting that attacks have occurred.",
    "D2-LESSON-008": "IOCs help detect breaches. The next lesson covers Hardening - reducing attack surface through secure configuration.",
    "D2-LESSON-009": "Hardening reduces exposure. The next lesson covers Mitigation Techniques - responding when attacks get through.",
    "D2-LESSON-010": "Mitigations limit damage. The next lesson covers Attack Frameworks - structured models for understanding adversary behavior.",
    "D2-LESSON-011": "Frameworks help us think like attackers. The next lesson covers Security Assessments - testing our defenses.",
    "D2-LESSON-012": "Domain 2 complete! You now understand threats and mitigations. Domain 3 covers Security Architecture - building secure systems.",
    "D3-LESSON-001": "Architecture principles guide design. The next lesson covers Infrastructure Security - securing physical and virtual components.",
    "D3-LESSON-002": "Infrastructure is the foundation. The next lesson covers Network Security - protecting data in transit.",
    "D3-LESSON-003": "Wired networks are just the start. The next lesson covers Wireless Security - unique challenges of radio communications.",
    "D3-LESSON-004": "Wireless leads to cloud. The next lesson covers Cloud Security - protecting assets in shared infrastructure.",
    "D3-LESSON-005": "Cloud services need encryption. The next lesson covers Cryptography - the mathematical foundation of data protection.",
    "D3-LESSON-006": "Encryption protects data, but systems fail. The next lesson covers Resilience & Recovery - ensuring business continuity.",
    "D3-LESSON-007": "Resilience protects systems. The next lesson covers Data Protection - classification, handling, and lifecycle.",
    "D3-LESSON-008": "Domain 3 complete! You now understand security architecture. Domain 4 covers Security Operations - day-to-day defense.",
    "D4-LESSON-001": "Monitoring detects threats. The next lesson covers Incident Response - what to do when you find something.",
    "D4-LESSON-002": "Incident response captures evidence. The next lesson covers Digital Forensics - analyzing evidence to understand attacks.",
    "D4-LESSON-003": "Forensics happens after incidents. The next lesson covers Vulnerability Management - proactively finding weaknesses.",
    "D4-LESSON-004": "Vulnerabilities provide access. The next lesson covers Identity & Access Management - controlling who can access what.",
    "D4-LESSON-005": "IAM controls access to data. The next lesson covers Data Protection in Operations - keeping data safe throughout its lifecycle.",
    "D4-LESSON-006": "Manual operations don't scale. The next lesson covers Security Automation - using SOAR to work smarter.",
    "D4-LESSON-007": "Domain 4 complete! You now understand security operations. Domain 5 covers Security Program Management - governance, risk, and compliance.",
    "D5-LESSON-001": "Governance sets direction. The next lesson covers Risk Management - identifying and prioritizing what matters.",
    "D5-LESSON-002": "Risk extends to partners. The next lesson covers Third-Party Risk Management - trusting your vendors.",
    "D5-LESSON-003": "Vendors must comply with regulations. The next lesson covers Security Compliance - meeting legal requirements.",
    "D5-LESSON-004": "Compliance must be verified. The next lesson covers Audits & Assessments - validating that controls work.",
    "D5-LESSON-005": "Technical controls need human support. The final lesson covers Security Awareness - building a culture of security.",
    "D5-LESSON-006": "Congratulations! You've completed all 5 domains. You're ready for the Security+ exam!",
}


def convert_why_it_matters(lesson):
    """
    Convert why_it_matters from STRING to OBJECT format
    PRESERVES the original string content
    """
    intro = lesson.get('introduction', {})
    wim = intro.get('why_it_matters')
    
    if wim is None:
        return False, "missing"
    
    if isinstance(wim, str):
        # Convert string to object, preserving content
        lesson['introduction']['why_it_matters'] = {
            "career_impact": wim,  # Put the original string here
            "business_connection": "",
            "exam_relevance": ""
        }
        return True, "converted"
    
    if isinstance(wim, dict):
        # Already object format - normalize keys if needed
        normalized = {
            "career_impact": wim.get('career_impact', wim.get('real_world_connection', '')),
            "business_connection": wim.get('business_connection', ''),
            "exam_relevance": wim.get('exam_relevance', '')
        }
        # Only update if we actually changed something
        if normalized != wim:
            lesson['introduction']['why_it_matters'] = normalized
            return True, "normalized_keys"
        return False, "already_object"
    
    return False, "unknown_type"


def convert_skill_tree_prereqs(lesson):
    """
    Convert skill_tree.prerequisites from STRING array to OBJECT array
    PRESERVES the lesson IDs, adds titles from lookup
    """
    st = lesson.get('skill_tree', {})
    prereqs = st.get('prerequisites', [])
    
    if not prereqs:
        return False, "empty"
    
    if isinstance(prereqs[0], dict):
        return False, "already_object"
    
    if isinstance(prereqs[0], str):
        # Convert string array to object array
        new_prereqs = []
        for prereq_id in prereqs:
            new_prereqs.append({
                "lesson_id": prereq_id,
                "title": LESSON_TITLES.get(prereq_id, prereq_id),
                "why_needed": "Provides foundational concepts for this lesson"
            })
        lesson['skill_tree']['prerequisites'] = new_prereqs
        return True, "converted"
    
    return False, "unknown_type"


def convert_skill_tree_unlocks(lesson):
    """
    Convert skill_tree.unlocks from STRING array to OBJECT array
    PRESERVES the lesson IDs, adds titles from lookup
    """
    st = lesson.get('skill_tree', {})
    unlocks = st.get('unlocks', [])
    
    if not unlocks:
        return False, "empty"
    
    if isinstance(unlocks[0], dict):
        return False, "already_object"
    
    if isinstance(unlocks[0], str):
        # Convert string array to object array
        new_unlocks = []
        for unlock_id in unlocks:
            new_unlocks.append({
                "lesson_id": unlock_id,
                "title": LESSON_TITLES.get(unlock_id, unlock_id),
                "connection": "Builds upon concepts from this lesson"
            })
        lesson['skill_tree']['unlocks'] = new_unlocks
        return True, "converted"
    
    return False, "unknown_type"


def add_subtitle_if_missing(lesson, lesson_id):
    """Add subtitle ONLY if missing"""
    if lesson.get('subtitle'):
        return False, "exists"
    
    subtitle = SUBTITLES.get(lesson_id)
    if subtitle:
        lesson['subtitle'] = subtitle
        return True, "added"
    
    return False, "no_default"


def add_connection_if_missing(lesson, lesson_id):
    """Add connection_to_next ONLY if missing"""
    if 'summary' not in lesson:
        lesson['summary'] = {}
    
    if lesson['summary'].get('connection_to_next'):
        return False, "exists"
    
    connection = CONNECTIONS.get(lesson_id)
    if connection:
        lesson['summary']['connection_to_next'] = connection
        return True, "added"
    
    return False, "no_default"


def normalize_memory_hooks_in_section(section):
    """
    Normalize memory_hooks keys from singular to plural
    PRESERVES all content
    """
    mh = section.get('memory_hooks')
    if not mh or not isinstance(mh, dict):
        return False
    
    changed = False
    
    # mnemonic → mnemonics (preserve content)
    if 'mnemonic' in mh and 'mnemonics' not in mh:
        val = mh.pop('mnemonic')
        mh['mnemonics'] = [val] if isinstance(val, str) else val
        changed = True
    
    # analogy → analogies (preserve content)
    if 'analogy' in mh and 'analogies' not in mh:
        val = mh.pop('analogy')
        mh['analogies'] = [val] if isinstance(val, str) else val
        changed = True
    
    return changed


def normalize_lesson(filepath):
    """Apply all normalizations to a lesson, preserving content"""
    with open(filepath, 'r', encoding='utf-8') as f:
        lesson = json.load(f)
    
    lesson_id = lesson.get('lesson_id', '')
    changes = []
    
    # 1. Convert why_it_matters format
    changed, status = convert_why_it_matters(lesson)
    if changed:
        changes.append(f"why_it_matters:{status}")
    
    # 2. Convert skill_tree.prerequisites format
    changed, status = convert_skill_tree_prereqs(lesson)
    if changed:
        changes.append(f"prereqs:{status}")
    
    # 3. Convert skill_tree.unlocks format  
    changed, status = convert_skill_tree_unlocks(lesson)
    if changed:
        changes.append(f"unlocks:{status}")
    
    # 4. Add subtitle if missing
    changed, status = add_subtitle_if_missing(lesson, lesson_id)
    if changed:
        changes.append(f"subtitle:{status}")
    
    # 5. Add connection_to_next if missing
    changed, status = add_connection_if_missing(lesson, lesson_id)
    if changed:
        changes.append(f"connection:{status}")
    
    # 6. Normalize memory_hooks in all sections
    mh_count = 0
    for section in lesson.get('sections', []):
        if normalize_memory_hooks_in_section(section):
            mh_count += 1
    if mh_count > 0:
        changes.append(f"memory_hooks:{mh_count}_sections")
    
    return lesson, changes


def main():
    source_dir = '/mnt/project'
    output_dir = '/home/claude/security-plus-platform/data'
    
    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)
    
    # Get all lesson files
    lesson_files = sorted([f for f in os.listdir(source_dir) 
                          if 'LESSON' in f and f.endswith('.json')])
    
    print("=" * 80)
    print("PRESERVATION-FIRST JSON NORMALIZATION")
    print("=" * 80)
    print(f"\nProcessing {len(lesson_files)} lesson files...")
    print("Strategy: PRESERVE content, CONVERT formats only\n")
    
    total_changes = 0
    files_changed = 0
    
    for filename in lesson_files:
        filepath = os.path.join(source_dir, filename)
        
        lesson, changes = normalize_lesson(filepath)
        
        # Save to output directory
        output_path = os.path.join(output_dir, filename)
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(lesson, f, indent=2, ensure_ascii=False)
        
        if changes:
            print(f"✅ {filename}")
            print(f"   Changes: {', '.join(changes)}")
            files_changed += 1
            total_changes += len(changes)
        else:
            print(f"⏭️  {filename} - no changes needed")
    
    print("\n" + "=" * 80)
    print(f"COMPLETE: {files_changed} files modified, {total_changes} total changes")
    print(f"Output: {output_dir}")
    print("=" * 80)


if __name__ == '__main__':
    main()
