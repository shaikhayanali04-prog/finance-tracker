import glob
import os

files = glob.glob("frontend/src/pages/*.js")

for f in files:
    if "apiFetch" in open(f).read():
        continue
    if "Login" in f or "Register" in f or "Landing" in f:
        continue

    content = open(f).read()
    content = 'import { apiFetch } from "../utils/api";\n' + content
    content = content.replace("await fetch(", "await apiFetch(")
    
    with open(f, "w") as out:
        out.write(content)
    
    print(f"Injected apiFetch into {f}")
