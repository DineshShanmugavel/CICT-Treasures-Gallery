#!/bin/sh
# CICT Tamil Treasures Gallery: serve this folder to the office network on port 8080.
#   sh start-local-server.sh          (or: chmod +x start-local-server.sh && ./start-local-server.sh)
#   sh start-local-server.sh 9000     another port
# Uses Node.js if installed, otherwise Python 3.
cd "$(dirname "$0")" || exit 1
PORT="${1:-8080}"

if command -v node >/dev/null 2>&1; then
  exec node serve-museum.mjs "$PORT"
fi

for PY in python3 python; do
  if command -v "$PY" >/dev/null 2>&1; then
    echo "Node.js not found - using Python. Recordings and films may not allow seeking."
    echo "Open http://localhost:$PORT/ here, or http://<this-machine's-address>:$PORT/ elsewhere."
    exec "$PY" -m http.server "$PORT" --bind 0.0.0.0
  fi
done

echo "Neither Node.js nor Python 3 is installed. Install Node.js (LTS) from https://nodejs.org/ and run this again."
exit 1
