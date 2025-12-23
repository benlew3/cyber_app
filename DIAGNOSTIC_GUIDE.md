# 🔍 DIAGNOSTIC GUIDE - Platform Loading Issues

## The Problem:
Your platform is stuck on "Loading content..." which means the JavaScript can't load the JSON data files.

---

## 🚨 **QUICK FIX STEPS:**

### 1. Check Browser Console (MOST IMPORTANT!)
Press **F12** (or Cmd+Option+I on Mac) and look at the **Console** tab for red error messages.

Common errors you might see:
- `404 Not Found` - Files are missing or in wrong location
- `Failed to fetch` - Path issues
- `Unexpected token` - JSON syntax error
- `CORS policy` - Loading from file:// instead of server

**Copy any error messages you see - they tell us exactly what's wrong!**

---

### 2. Verify Your File Structure
Your GitHub repository should have this EXACT structure:

```
YOUR-REPO/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   └── quiz.js
└── data/              ← THIS IS CRITICAL!
    ├── questions.json
    ├── simulations.json
    ├── lessons.json
    ├── pbqs.json
    └── glossary.json
```

**IMPORTANT:** The `data` folder must be at the ROOT level, not inside another folder!

---

### 3. Check If Files Are Uploaded to GitHub

Go to your GitHub repository and verify:
1. Click on the `data` folder
2. You should see all 5 JSON files
3. Click on `questions.json`
4. It should show JSON content (not an error)

If files are missing:
```bash
# In your local folder
ls -la data/
# Should show all 5 JSON files

# If missing, check your tar extraction
cd ~/Documents/cyber_app
ls -la security-plus-platform/data/
```

---

### 4. Test with Diagnostic Version

Replace your app.js temporarily with the diagnostic version:

```bash
# Save the diagnostic version as app.js
cd ~/Documents/cyber_app/security-plus-platform/js
mv app.js app_backup.js
cp ~/Downloads/app_diagnostic.js app.js

# Commit and push
git add .
git commit -m "Add diagnostic logging"
git push
```

Then check your site and look at the console - it will show detailed loading information.

---

## 🧪 **DIAGNOSTIC CHECKLIST:**

### Local Testing:
```bash
# Test locally first
cd ~/Documents/cyber_app/security-plus-platform
python3 -m http.server 8000

# Open browser to http://localhost:8000
# Press F12 for console
# Look for errors
```

### Check Each File:
```bash
# Verify JSON files are valid
cd data

# Test each file
python3 -c "import json; json.load(open('questions.json'))"
python3 -c "import json; json.load(open('simulations.json'))"
python3 -c "import json; json.load(open('lessons.json'))"
python3 -c "import json; json.load(open('pbqs.json'))"
python3 -c "import json; json.load(open('glossary.json'))"

# If any show error, that file has invalid JSON
```

---

## 📊 **COMMON ISSUES & FIXES:**

### Issue 1: 404 Not Found on data files
**Fix:** Files are in wrong location or not uploaded
```bash
# Check file locations
find . -name "*.json"

# Should show:
# ./data/questions.json
# ./data/simulations.json
# etc.
```

### Issue 2: CORS errors when testing locally
**Fix:** Use a local server, not file://
```bash
# Don't open index.html directly
# Instead use:
python3 -m http.server 8000
# Then visit http://localhost:8000
```

### Issue 3: JSON parse errors
**Fix:** JSON file has syntax error
```bash
# Validate JSON online
# Go to: https://jsonlint.com
# Paste your JSON content
# It will show where the error is
```

### Issue 4: GitHub Pages not updating
**Fix:** Clear cache or wait longer
```bash
# Force refresh in browser
# Mac: Cmd + Shift + R
# Windows: Ctrl + Shift + R

# Or check GitHub Actions
# Go to your repo → Actions tab
# Check if build succeeded
```

---

## 🔧 **EMERGENCY FIX:**

If nothing else works, create a minimal test:

1. **Create test.html in your repo root:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Data Test</title>
</head>
<body>
    <h1>Testing Data Loading</h1>
    <div id="result"></div>
    
    <script>
        fetch('data/questions.json')
            .then(r => r.json())
            .then(data => {
                document.getElementById('result').innerHTML = 
                    '✅ Loaded ' + data.length + ' questions';
            })
            .catch(err => {
                document.getElementById('result').innerHTML = 
                    '❌ Error: ' + err.message;
                console.error(err);
            });
    </script>
</body>
</html>
```

2. **Push and test:**
```bash
git add test.html
git commit -m "Add data loading test"
git push
```

3. **Visit:** `https://YOUR-USERNAME.github.io/YOUR-REPO/test.html`

This will tell us if the basic file loading works.

---

## 📝 **INFORMATION TO PROVIDE:**

Please share:

1. **Console errors** (F12 → Console tab)
   - Copy/screenshot any red error messages

2. **GitHub repository structure**
   - Screenshot of your repo showing the folders

3. **One test URL**
   - Try: `https://YOUR-USERNAME.github.io/YOUR-REPO/data/questions.json`
   - Does it show JSON or 404?

4. **Local test results**
   - What happens when testing with python server?

---

## 💡 **MOST LIKELY CAUSE:**

Based on the loading screen, the most likely issues are:
1. **data/ folder is missing or in wrong location**
2. **JSON files weren't uploaded to GitHub**
3. **Path issue in the code (looking in wrong location)**

**Quick Check:**
Visit: `https://YOUR-USERNAME.github.io/YOUR-REPO/data/questions.json`

- If you see JSON data → File exists, might be CORS or parsing issue
- If you see 404 → File doesn't exist at that location
- If you see HTML → GitHub Pages isn't serving the file correctly

---

Let me know what errors you see in the console and I can provide a specific fix!
