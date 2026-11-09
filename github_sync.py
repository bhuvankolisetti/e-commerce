"""
GitHub Auto-Sync Utility for Amazon Clone Project
Supports both Git CLI and direct GitHub REST API uploading.
Author: Bhuvan Kolisetti
Repository: https://github.com/bhuvankolisetti/e-commerce
"""

import os
import sys
import subprocess
import argparse
import base64
import urllib.request
import urllib.error
import json

REPO_OWNER = "bhuvankolisetti"
REPO_NAME = "e-commerce"
REPO_URL = f"https://github.com/{REPO_OWNER}/{REPO_NAME}.git"

def run_git_sync():
    print("[*] Running Git CLI Sync...")
    try:
        # Check git
        subprocess.run(["git", "--version"], check=True, stdout=subprocess.PIPE)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("[!] Git executable not found in PATH.")
        print("[!] Please run 'push_to_github.ps1' or install Git from https://git-scm.com")
        return False

    # Git sequence
    commands = [
        ["git", "init"],
        ["git", "config", "user.name", "Bhuvan Kolisetti"],
        ["git", "config", "user.email", "bhuvankolisetti@users.noreply.github.com"],
        ["git", "branch", "-M", "main"],
        ["git", "remote", "remove", "origin"],
        ["git", "remote", "add", "origin", REPO_URL],
        ["git", "add", "-A"],
        ["git", "commit", "-m", "Amazon Clone Final Year Project update"],
        ["git", "push", "-u", "origin", "main"]
    ]

    for cmd in commands:
        try:
            print(f" -> Running: {' '.join(cmd)}")
            subprocess.run(cmd, check=False)
        except Exception as e:
            print(f"Error running {cmd}: {e}")

    print(f"\n[✓] Git sync finished! Check: https://github.com/{REPO_OWNER}/{REPO_NAME}")
    return True

def upload_via_github_api(token):
    print(f"[*] Uploading files directly via GitHub REST API to {REPO_OWNER}/{REPO_NAME}...")
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Amazon-Clone-Sync"
    }

    base_dir = os.path.dirname(os.path.abspath(__file__))
    ignored = ['.git', '__pycache__', 'ecommerce.db', '.vscode']

    for root, dirs, files in os.walk(base_dir):
        dirs[:] = [d for d in dirs if d not in ignored]
        for file in files:
            if file.endswith(('.pyc', '.db-journal')):
                continue
            
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, base_dir).replace('\\', '/')

            with open(full_path, 'rb') as f:
                content_bytes = f.read()

            content_b64 = base64.b64encode(content_bytes).decode('utf-8')

            # Check if file exists on GitHub to obtain its SHA
            file_url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents/{rel_path}"
            sha = None
            try:
                req = urllib.request.Request(file_url, headers=headers)
                with urllib.request.urlopen(req) as resp:
                    data = json.loads(resp.read().decode('utf-8'))
                    sha = data.get('sha')
            except urllib.error.HTTPError as e:
                if e.code != 404:
                    print(f"Notice checking {rel_path}: {e}")

            payload = {
                "message": f"Upload {rel_path} - Amazon Clone Final Year Project",
                "content": content_b64,
                "branch": "main"
            }
            if sha:
                payload["sha"] = sha

            req = urllib.request.Request(
                file_url,
                data=json.dumps(payload).encode('utf-8'),
                headers=headers,
                method='PUT'
            )

            try:
                with urllib.request.urlopen(req) as resp:
                    print(f" [✓] Uploaded: {rel_path}")
            except Exception as e:
                print(f" [!] Failed {rel_path}: {e}")

    print(f"\n[✓] All files synced to https://github.com/{REPO_OWNER}/{REPO_NAME}!")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Sync project files to GitHub")
    parser.add_argument("--token", help="GitHub Personal Access Token (for direct API upload)")
    args = parser.parse_args()

    if args.token:
        upload_via_github_api(args.token)
    else:
        run_git_sync()

