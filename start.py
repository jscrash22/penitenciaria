import os
import sys
import webbrowser
import time
import subprocess

os.chdir(os.path.dirname(os.path.abspath(__file__)))

def try_server():
    try:
        subprocess.Popen([sys.executable, '-m', 'http.server', '8080'], creationflags=subprocess.CREATE_NO_WINDOW)
        return True
    except Exception:
        try:
            subprocess.Popen(['python', '-m', 'http.server', '8080'], creationflags=subprocess.CREATE_NO_WINDOW)
            return True
        except Exception:
            try:
                subprocess.Popen(['python3', '-m', 'http.server', '8080'], creationflags=subprocess.CREATE_NO_WINDOW)
                return True
            except Exception:
                return False

if try_server():
    time.sleep(1.5)
    webbrowser.open('http://localhost:8080/')
    sys.exit(0)
else:
    sys.exit(1)