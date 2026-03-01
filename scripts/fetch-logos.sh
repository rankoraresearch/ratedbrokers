#!/usr/bin/env bash
# Скачивание логотипов брокеров через Google Favicon API (128px PNG)
set -uo pipefail

DIR="$(cd "$(dirname "$0")/../public/logos" && pwd)"
mkdir -p "$DIR"

PAIRS="
ic-markets:icmarkets.com
pepperstone:pepperstone.com
fp-markets:fpmarkets.com
xm:xm.com
exness:exness.com
tickmill:tickmill.com
vantage:vantagemarkets.com
ig:ig.com
oanda:oanda.com
etoro:etoro.com
plus500:plus500.com
saxo-bank:home.saxo
cmc-markets:cmcmarkets.com
xtb:xtb.com
fxpro:fxpro.com
admirals:admirals.com
swissquote:swissquote.com
dukascopy:dukascopy.com
libertex:libertex.com
avatrade:avatrade.com
fxcm:fxcm.com
hfm:hfm.com
thinkmarkets:thinkmarkets.com
fxtm:fxtm.com
capital-com:capital.com
roboforex:roboforex.com
blackbull:blackbull.com
axi:axi.com
fusion-markets:fusionmarkets.com
go-markets:gomarkets.com
naga:naga.com
city-index:cityindex.com
spreadex:spreadex.com
"

ok=0; fail=0
for pair in $PAIRS; do
  slug="${pair%%:*}"
  domain="${pair##*:}"
  out="$DIR/${slug}.png"
  if curl -fsSL -o "$out" "https://www.google.com/s2/favicons?domain=${domain}&sz=128"; then
    ok=$((ok+1))
    echo "✓ ${slug} (${domain})"
  else
    fail=$((fail+1))
    echo "✗ ${slug} (${domain})" >&2
  fi
done

echo ""
echo "Done: ${ok} ok, ${fail} failed"
