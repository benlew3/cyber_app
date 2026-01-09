#!/usr/bin/env python3
"""
Phase 2: Normalize D3/D4/D5 Lessons to Full Schema
Converts:
- why_it_matters: STRING → OBJECT
- skill_tree.prerequisites: STRING → OBJECT  
- skill_tree.unlocks: STRING → OBJECT
- Adds subtitle field
- Ensures summary has connection_to_next
- Normalizes memory_hooks keys to plural form
"""

import json
import os
from copy import deepcopy

# Lesson titles lookup for converting string IDs to full objects
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

# Subtitles to add
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

# Connection to next for summaries
CONNECTIONS = {
    "D3-LESSON-001": "Now that you understand architecture principles, the next lesson covers Infrastructure Security - how to secure the physical and virtual components.",
    "D3-LESSON-002": "With infrastructure secured, the next lesson covers Network Security - protecting data as it moves between systems.",
    "D3-LESSON-003": "Beyond wired networks, the next lesson covers Wireless Security - the unique challenges of securing radio communications.",
    "D3-LESSON-004": "Wireless leads to cloud. The next lesson covers Cloud Security - protecting assets in shared infrastructure.",
    "D3-LESSON-005": "Cloud services need encryption. The next lesson covers Cryptography - the mathematical foundation of data protection.",
    "D3-LESSON-006": "Encryption protects data, but systems fail. The next lesson covers Resilience & Recovery - ensuring business continuity.",
    "D3-LESSON-007": "Resilience protects systems, but what about the data itself? The next lesson covers Data Protection - classification, handling, and lifecycle.",
    "D3-LESSON-008": "Domain 3 complete! You now understand security architecture. Domain 4 covers Security Operations - the day-to-day work of defending organizations.",
    "D4-LESSON-001": "Monitoring detects threats. The next lesson covers Incident Response - what to do when you find something.",
    "D4-LESSON-002": "Incident response captures evidence. The next lesson covers Digital Forensics - analyzing evidence to understand attacks.",
    "D4-LESSON-003": "Forensics happens after incidents. The next lesson covers Vulnerability Management - proactively finding weaknesses before attackers.",
    "D4-LESSON-004": "Vulnerabilities provide access. The next lesson covers Identity & Access Management - controlling who can access what.",
    "D4-LESSON-005": "IAM controls access to data. The next lesson covers Data Protection in Operations - keeping data safe throughout its lifecycle.",
    "D4-LESSON-006": "Manual operations don't scale. The next lesson covers Security Automation - using SOAR to work smarter.",
    "D4-LESSON-007": "Domain 4 complete! You now understand security operations. Domain 5 covers Security Program Management - governance, risk, and compliance.",
    "D5-LESSON-001": "Governance sets direction. The next lesson covers Risk Management - identifying and prioritizing what matters.",
    "D5-LESSON-002": "Risk extends to partners. The next lesson covers Third-Party Risk Management - trusting your vendors.",
    "D5-LESSON-003": "Vendors must comply with regulations. The next lesson covers Security Compliance - meeting legal and regulatory requirements.",
    "D5-LESSON-004": "Compliance must be verified. The next lesson covers Audits & Assessments - validating that controls work.",
    "D5-LESSON-005": "Technical controls need human support. The final lesson covers Security Awareness - building a culture of security.",
    "D5-LESSON-006": "Congratulations! You've completed all 5 domains. You're ready for the Security+ exam!",
}

def normalize_why_it_matters(lesson):
    """Convert string why_it_matters to object format"""
    intro = lesson.get('introduction', {})
    wim = intro.get('why_it_matters')
    
    if isinstance(wim, str) and wim:
        # Convert string to object
        lesson['introduction']['why_it_matters'] = {
            "career_impact": f"Understanding this topic is essential for security professionals. {wim[:200]}...",
            "business_connection": "Organizations rely on these concepts to protect their assets and meet compliance requirements.",
            "exam_relevance": f"This topic appears frequently on the Security+ exam. {wim[:150]}..."
        }
        return True
    return False

def normalize_skill_tree(lesson, lesson_id):
    """Convert string arrays in skill_tree to object arrays"""
    skill_tree = lesson.get('skill_tree', {})
    changes = []
    
    # Normalize prerequisites
    prereqs = skill_tree.get('prerequisites', [])
    if prereqs and isinstance(prereqs[0], str):
        new_prereqs = []
        for prereq_id in prereqs:
            title = LESSON_TITLES.get(prereq_id, prereq_id)
            new_prereqs.append({
                "lesson_id": prereq_id,
                "title": title,
                "why_needed": f"Provides foundation concepts required for this lesson"
            })
        skill_tree['prerequisites'] = new_prereqs
        changes.append('prerequisites')
    
    # Normalize unlocks
    unlocks = skill_tree.get('unlocks', [])
    if unlocks and isinstance(unlocks[0], str):
        new_unlocks = []
        for unlock_id in unlocks:
            title = LESSON_TITLES.get(unlock_id, unlock_id)
            new_unlocks.append({
                "lesson_id": unlock_id,
                "title": title,
                "connection": f"Builds upon concepts from this lesson"
            })
        skill_tree['unlocks'] = new_unlocks
        changes.append('unlocks')
    
    if changes:
        lesson['skill_tree'] = skill_tree
    
    return changes

def normalize_memory_hooks(section):
    """Convert singular memory_hooks keys to plural"""
    mh = section.get('memory_hooks', {})
    if not mh:
        return False
    
    changes = False
    
    # mnemonic -> mnemonics
    if 'mnemonic' in mh and 'mnemonics' not in mh:
        mh['mnemonics'] = [mh['mnemonic']] if isinstance(mh['mnemonic'], str) else mh['mnemonic']
        del mh['mnemonic']
        changes = True
    
    # analogy -> analogies
    if 'analogy' in mh and 'analogies' not in mh:
        mh['analogies'] = [mh['analogy']] if isinstance(mh['analogy'], str) else mh['analogy']
        del mh['analogy']
        changes = True
    
    # Ensure common_mistakes is a list
    if 'common_mistakes' in mh:
        if isinstance(mh['common_mistakes'], str):
            mh['common_mistakes'] = [mh['common_mistakes']]
        elif isinstance(mh['common_mistakes'], list) and mh['common_mistakes']:
            if isinstance(mh['common_mistakes'][0], dict):
                # Convert dict format to simple strings
                mh['common_mistakes'] = [cm.get('mistake', str(cm)) for cm in mh['common_mistakes']]
    
    section['memory_hooks'] = mh
    return changes

def add_subtitle(lesson, lesson_id):
    """Add subtitle if missing"""
    if 'subtitle' not in lesson or not lesson['subtitle']:
        subtitle = SUBTITLES.get(lesson_id, f"Understanding {lesson.get('title', 'Security Concepts')}")
        lesson['subtitle'] = subtitle
        return True
    return False

def add_connection_to_next(lesson, lesson_id):
    """Ensure summary has connection_to_next"""
    summary = lesson.get('summary', {})
    if 'connection_to_next' not in summary or not summary['connection_to_next']:
        connection = CONNECTIONS.get(lesson_id, "Continue to the next lesson to build on these concepts.")
        if 'summary' not in lesson:
            lesson['summary'] = {}
        lesson['summary']['connection_to_next'] = connection
        return True
    return False

def normalize_lesson(filepath):
    """Apply all normalizations to a lesson"""
    with open(filepath, 'r', encoding='utf-8') as f:
        lesson = json.load(f)
    
    lesson_id = lesson.get('lesson_id', '')
    changes = []
    
    # Apply normalizations
    if normalize_why_it_matters(lesson):
        changes.append('why_it_matters→object')
    
    st_changes = normalize_skill_tree(lesson, lesson_id)
    if st_changes:
        changes.extend([f'skill_tree.{c}→object' for c in st_changes])
    
    if add_subtitle(lesson, lesson_id):
        changes.append('subtitle')
    
    if add_connection_to_next(lesson, lesson_id):
        changes.append('connection_to_next')
    
    # Normalize memory_hooks in all sections
    mh_count = 0
    for section in lesson.get('sections', []):
        if normalize_memory_hooks(section):
            mh_count += 1
    if mh_count:
        changes.append(f'memory_hooks({mh_count} sections)')
    
    return lesson, changes

def main():
    source_dir = '/mnt/project'
    output_dir = '/home/claude/security-plus-platform/data'
    
    # Files to normalize (D3, D4, D5 lessons)
    files = [f for f in os.listdir(source_dir) 
             if f.endswith('.json') and 'LESSON' in f 
             and (f.startswith('D3-') or f.startswith('D4-') or f.startswith('D5-'))]
    files = sorted(files)
    
    print("=" * 70)
    print("PHASE 2: Normalizing D3/D4/D5 Lessons")
    print("=" * 70)
    
    total_changes = 0
    
    for filename in files:
        filepath = os.path.join(source_dir, filename)
        print(f"\n📝 Processing: {filename}")
        
        lesson, changes = normalize_lesson(filepath)
        
        if changes:
            output_path = os.path.join(output_dir, filename)
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(lesson, f, indent=2, ensure_ascii=False)
            print(f"  ✅ Normalized and saved")
            print(f"  📦 Changes: {', '.join(changes)}")
            total_changes += len(changes)
        else:
            # Still copy to output for completeness
            output_path = os.path.join(output_dir, filename)
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(lesson, f, indent=2, ensure_ascii=False)
            print(f"  ⏭️  No changes needed, copied as-is")
    
    print("\n" + "=" * 70)
    print(f"Phase 2 Complete! Total changes: {total_changes}")
    print("=" * 70)

if __name__ == '__main__':
    main()
