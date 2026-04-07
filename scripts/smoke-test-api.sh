#!/usr/bin/env bash
# Smoke tests HTTP pour l'API MTACMN (api.php).
# Usage:
#   MTACMN_API_BASE=http://127.0.0.1:8000 ./scripts/smoke-test-api.sh
#   MTACMN_API_BASE=https://exemple.td ./scripts/smoke-test-api.sh
#
# Prérequis: curl. Optionnel: jq ou python3 pour extraire l'ID article.

set -uo pipefail

BASE="${MTACMN_API_BASE:-http://127.0.0.1:8000}"
API="${BASE%/}/api.php"

PASS=0
FAIL=0
BODY=""
NEW_ID=""

tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT

die() { echo "ABORT: $*" >&2; exit 1; }

http_request() {
  local method="$1"
  local subpath="$2"
  local data="${3:-}"
  local url="${API}${subpath}"
  local code
  if [[ -n "$data" ]]; then
    code=$(curl -sS -o "$tmp_dir/body" -w "%{http_code}" -X "$method" "$url" \
      -H "Content-Type: application/json" \
      --data-binary "$data") || return 1
  else
    code=$(curl -sS -o "$tmp_dir/body" -w "%{http_code}" -X "$method" "$url") || return 1
  fi
  BODY="$(cat "$tmp_dir/body")"
  echo "$code"
}

expect_code() {
  local name="$1"
  local got="$2"
  local want="$3"
  if [[ "$got" == "$want" ]]; then
    echo "  OK  $name (HTTP $got)"
    PASS=$((PASS + 1))
  else
    echo "  FAIL $name — attendu HTTP $want, reçu $got"
    if [[ -n "${BODY}" ]] && [[ ${#BODY} -lt 500 ]]; then
      echo "       corps: $BODY"
    fi
    FAIL=$((FAIL + 1))
  fi
}

json_get_id() {
  if command -v jq >/dev/null 2>&1; then
    jq -r '.id // empty' <<<"$BODY"
  elif command -v python3 >/dev/null 2>&1; then
    python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('id') or '')" <<<"$BODY"
  else
    die "Installez jq ou python3 pour parser la création d'article"
  fi
}

echo "=== Smoke API ==="
echo "Base: $BASE"
echo ""

# --- Santé ---
code=$(http_request GET "" "") || die "curl impossible — stack démarrée ? ($BASE)"
expect_code "GET $API (santé)" "$code" "200"
if ! echo "$BODY" | grep -q success; then
  echo "  WARN réponse santé sans 'success' — corps: ${BODY:0:200}"
fi

# --- Liste articles ---
code=$(http_request GET "/articles" "") || die "curl GET /articles"
expect_code "GET .../articles" "$code" "200"

# --- Stats ---
code=$(http_request GET "/articles/stats" "") || die "curl GET /articles/stats"
expect_code "GET .../articles/stats" "$code" "200"

# --- Settings (lecture) ---
code=$(http_request GET "/settings" "") || die "curl GET /settings"
expect_code "GET .../settings" "$code" "200"

# --- Settings (écriture) ---
SMOKE_KEY="smoke_test_$(date +%s)"
code=$(http_request PUT "/settings" "{\"key\":\"${SMOKE_KEY}\",\"value\":\"ok\"}") || die "curl PUT /settings"
expect_code "PUT .../settings" "$code" "200"

# --- Article invalide (404) ---
code=$(http_request GET "/articles/999999999" "") || die "curl GET article inexistant"
expect_code "GET .../articles/999999999 (404)" "$code" "404"

# --- Création article ---
PAYLOAD=$(cat <<EOF
{"titre":"Smoke API $(date -Iseconds)","date":"30/03/2026","categorie":"Transports","resume":"Résumé smoke","contenu":"Contenu smoke","image":"","statut":"Brouillon"}
EOF
)
code=$(http_request POST "/articles" "$PAYLOAD") || die "curl POST /articles"
expect_code "POST .../articles (création)" "$code" "201"
NEW_ID="$(json_get_id)"
if [[ -z "$NEW_ID" ]]; then
  echo "  FAIL extraction id article après POST (corps JSON invalide ?)"
  FAIL=$((FAIL + 1))
else
  echo "       id créé: $NEW_ID"
fi

# --- Lecture par id ---
if [[ -n "$NEW_ID" ]]; then
  code=$(http_request GET "/articles/${NEW_ID}" "") || die "curl GET by id"
  expect_code "GET .../articles/${NEW_ID}" "$code" "200"
fi

# --- Mise à jour partielle ---
if [[ -n "$NEW_ID" ]]; then
  code=$(http_request PUT "/articles/${NEW_ID}" '{"une":true}') || die "curl PUT partial"
  expect_code "PUT .../articles/${NEW_ID} (partial)" "$code" "200"
fi

# --- Suppression ---
if [[ -n "$NEW_ID" ]]; then
  code=$(http_request DELETE "/articles/${NEW_ID}" "") || die "curl DELETE"
  expect_code "DELETE .../articles/${NEW_ID}" "$code" "200"
fi

# --- Auth (401 attendu sans utilisateur valide) ---
code=$(http_request POST "/auth" '{"username":"__smoke_invalid__","password":"__no__"}') || die "curl POST /auth"
expect_code "POST .../auth (identifiants invalides → 401)" "$code" "401"

# --- OPTIONS CORS ---
code=$(curl -sS -o /dev/null -w "%{http_code}" -X OPTIONS "$API/articles" \
  -H "Origin: http://example.com" \
  -H "Access-Control-Request-Method: GET") || die "curl OPTIONS"
expect_code "OPTIONS .../articles (preflight)" "$code" "200"

echo ""
echo "=== Résultat: $PASS ok, $FAIL échec(s) ==="
[[ "$FAIL" -eq 0 ]] || exit 1
