#!/usr/bin/env bash
set -e
JSON_MODE=false
for arg in "$@"; do case "$arg" in --json) JSON_MODE=true ;; --help|-h) echo "Uso: $0 [--json]"; exit 0 ;; esac; done
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"
eval $(get_feature_paths)
check_feature_branch "$CURRENT_BRANCH" || exit 1
mkdir -p "$FEATURE_DIR"
TEMPLATE="$REPO_ROOT/.specify/templates/plan-template.md"
[[ -f "$TEMPLATE" ]] && cp "$TEMPLATE" "$IMPL_PLAN"
if $JSON_MODE; then
  printf '{"FEATURE_SPEC":"%s","IMPL_PLAN":"%s","SPECS_DIR":"%s","BRANCH":"%s"}\n' \
    "$FEATURE_SPEC" "$IMPL_PLAN" "$FEATURE_DIR" "$CURRENT_BRANCH"
else
  echo "SPEC_DA_FEATURE: $FEATURE_SPEC"; echo "PLANO_DA_IMPL: $IMPL_PLAN"; echo "DIR_DAS_SPECS: $FEATURE_DIR"; echo "BRANCH: $CURRENT_BRANCH"
fi
