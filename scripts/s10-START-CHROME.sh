#!/bin/bash
# S10 one-time setup: launch user's Chrome with remote debugging port.
# Keep this terminal open — closing it kills Chrome.
#
# Usage: bash scripts/s10-START-CHROME.sh
#
# After running this, you'll get a fresh Chrome window. Go to
# linkedin.com and log in. Then in a DIFFERENT terminal run:
#   node scripts/s10-li-cdp-fetch.mjs
set -e

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PROFILE="/tmp/li-cdp-profile"
PORT=9222

if [ ! -x "$CHROME" ]; then
  echo "ERROR: Chrome not found at $CHROME"
  exit 1
fi

if lsof -iTCP:$PORT -sTCP:LISTEN -P -n 2>/dev/null | grep -q LISTEN; then
  echo "ERROR: port $PORT is already in use."
  echo "Either kill that process or use a different port."
  exit 1
fi

mkdir -p "$PROFILE"

echo "Starting Chrome with remote debugging on port $PORT"
echo "Profile dir: $PROFILE"
echo "Do NOT close this terminal or the Chrome window until fetch is done."
echo ""
echo "Next steps:"
echo "  1. A Chrome window will open."
echo "  2. Go to https://www.linkedin.com/ and log in."
echo "  3. In ANOTHER terminal run: node scripts/s10-li-cdp-fetch.mjs"
echo ""

exec "$CHROME" \
  --remote-debugging-port=$PORT \
  --user-data-dir="$PROFILE" \
  --no-first-run \
  --no-default-browser-check
