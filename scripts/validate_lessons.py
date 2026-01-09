#!/usr/bin/env python3
"""
Validation Script: Verify all normalized lesson files
"""

import json
import os
from collections import defaultdict

def validate_lessons():
    lesson_dir = '/home/claude/security-plus-platform/data'
    lesson_files = sorted([f for f in os.listdir(lesson_dir) if 'LESSON' in f and f.endswith('.json')])
    
    print("=" * 80)
    print("POST-NORMALIZATION VALIDATION REPORT")
    print("=" * 80)
    print(f"\n📊 Total lessons found: {len(lesson_files)}")
    
    results = {
        'has_learning_goals': [],
        'has_why_it_matters_object': [],
        'has_skill_tree_object_prereqs': [],
        'has_skill_tree_object_unlocks': [],
        'has_subtitle': [],
        'has_connection_to_next': [],
        'has_hands_on_activity': [],
        'has_what_would_you_do': [],
        'issues': defaultdict(list)
    }
    
    for filename in lesson_files:
        filepath = os.path.join(lesson_dir, filename)
        with open(filepath, 'r') as f:
            lesson = json.load(f)
        
        lesson_id = lesson.get('lesson_id', filename)
        
        # Check learning_goals
        intro = lesson.get('introduction', {})
        if intro.get('learning_goals'):
            results['has_learning_goals'].append(lesson_id)
        else:
            results['issues']['missing_learning_goals'].append(lesson_id)
        
        # Check why_it_matters is object
        wim = intro.get('why_it_matters')
        if isinstance(wim, dict):
            results['has_why_it_matters_object'].append(lesson_id)
        elif wim:
            results['issues']['why_it_matters_still_string'].append(lesson_id)
        else:
            results['issues']['missing_why_it_matters'].append(lesson_id)
        
        # Check skill_tree prerequisites
        st = lesson.get('skill_tree', {})
        prereqs = st.get('prerequisites', [])
        if prereqs and isinstance(prereqs[0], dict):
            results['has_skill_tree_object_prereqs'].append(lesson_id)
        elif prereqs and isinstance(prereqs[0], str):
            results['issues']['prereqs_still_string'].append(lesson_id)
        # Empty is OK for first lessons
        
        # Check skill_tree unlocks
        unlocks = st.get('unlocks', [])
        if unlocks and isinstance(unlocks[0], dict):
            results['has_skill_tree_object_unlocks'].append(lesson_id)
        elif unlocks and isinstance(unlocks[0], str):
            results['issues']['unlocks_still_string'].append(lesson_id)
        
        # Check subtitle
        if lesson.get('subtitle'):
            results['has_subtitle'].append(lesson_id)
        else:
            results['issues']['missing_subtitle'].append(lesson_id)
        
        # Check connection_to_next
        summary = lesson.get('summary', {})
        if summary.get('connection_to_next'):
            results['has_connection_to_next'].append(lesson_id)
        else:
            results['issues']['missing_connection_to_next'].append(lesson_id)
        
        # Check hands_on_activity
        if lesson.get('hands_on_activity'):
            results['has_hands_on_activity'].append(lesson_id)
        
        # Check what_would_you_do
        if lesson.get('what_would_you_do'):
            results['has_what_would_you_do'].append(lesson_id)
    
    # Print results
    print("\n" + "=" * 80)
    print("✅ FIELD COVERAGE (Target: 41 lessons)")
    print("=" * 80)
    
    checks = [
        ('learning_goals', 'has_learning_goals'),
        ('why_it_matters (object)', 'has_why_it_matters_object'),
        ('skill_tree prereqs (object)', 'has_skill_tree_object_prereqs'),
        ('skill_tree unlocks (object)', 'has_skill_tree_object_unlocks'),
        ('subtitle', 'has_subtitle'),
        ('connection_to_next', 'has_connection_to_next'),
        ('hands_on_activity', 'has_hands_on_activity'),
        ('what_would_you_do', 'has_what_would_you_do'),
    ]
    
    for label, key in checks:
        count = len(results[key])
        pct = count / 41 * 100
        status = "✅" if count >= 35 else "⚠️" if count >= 20 else "❌"
        print(f"  {status} {label}: {count}/41 ({pct:.0f}%)")
    
    print("\n" + "=" * 80)
    print("❌ REMAINING ISSUES")
    print("=" * 80)
    
    if not any(results['issues'].values()):
        print("\n  🎉 No issues found!")
    else:
        for issue, lessons in results['issues'].items():
            if lessons:
                print(f"\n  ⚠️ {issue.replace('_', ' ').title()}: {len(lessons)} lessons")
                for lid in lessons[:5]:
                    print(f"     - {lid}")
                if len(lessons) > 5:
                    print(f"     ... and {len(lessons) - 5} more")
    
    # Domain breakdown
    print("\n" + "=" * 80)
    print("📊 DOMAIN BREAKDOWN")
    print("=" * 80)
    
    domain_stats = defaultdict(lambda: {'total': 0, 'complete': 0})
    for filename in lesson_files:
        domain = filename[1]
        filepath = os.path.join(lesson_dir, filename)
        with open(filepath, 'r') as f:
            lesson = json.load(f)
        
        domain_stats[domain]['total'] += 1
        
        # Check completeness (has all major fields)
        intro = lesson.get('introduction', {})
        has_all = (
            intro.get('learning_goals') and
            isinstance(intro.get('why_it_matters'), dict) and
            lesson.get('subtitle') and
            lesson.get('summary', {}).get('connection_to_next')
        )
        if has_all:
            domain_stats[domain]['complete'] += 1
    
    for domain in sorted(domain_stats.keys()):
        stats = domain_stats[domain]
        pct = stats['complete'] / stats['total'] * 100 if stats['total'] > 0 else 0
        status = "✅" if pct == 100 else "⚠️" if pct >= 50 else "❌"
        print(f"  {status} Domain {domain}: {stats['complete']}/{stats['total']} complete ({pct:.0f}%)")
    
    print("\n" + "=" * 80)
    print("VALIDATION COMPLETE")
    print("=" * 80)

if __name__ == '__main__':
    validate_lessons()
