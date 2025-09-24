#!/usr/bin/env bash
set -e
JSON_MODE=false
for arg in "$@"; do case "$arg" in --json) JSON_MODE=true ;; --help|-h) echo "Uso: $0 [--json]"; exit 0 ;; esac; done
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"
eval $(get_feature_paths)
check_feature_branch "$CURRENT_BRANCH" || exit 1
if [[ ! -d "$FEATURE_DIR" ]]; then echo "ERRO: Diretório da feature não encontrado: $FEATURE_DIR"; echo "Execute /specify primeiro."; exit 1; fi
if [[ ! -f "$IMPL_PLAN" ]]; then echo "ERRO: plan.md não encontrado em $FEATURE_DIR"; echo "Execute /plan primeiro."; exit 1; fi
if $JSON_MODE; then
  docs=(); [[ -f "$RESEARCH" ]] && docs+=("research.md"); [[ -f "$DATA_MODEL" ]] && docs+=("data-model.md"); ([[ -d "$CONTRACTS_DIR" ]] && [[ -n "$(ls -A "$CONTRACTS_DIR" 2>/dev/null)" ]]) && docs+=("contracts/"); [[ -f "$QUICKSTART" ]] && docs+=("quickstart.md");
  json_docs=$(printf '"%s",' "${docs[@]}"); json_docs="[${json_docs%,}]"; printf '{"FEATURE_DIR":"%s","AVAILABLE_DOCS":%s}\n' "$FEATURE_DIR" "$json_docs"
else
  echo "DIRETORIO_DA_FEATURE:$FEATURE_DIR"; echo "DOCUMENTOS_DISPONIVEIS:"; check_file "$RESEARCH" "research.md"; check_file "$DATA_MODEL" "data-model.md"; check_dir "$CONTRACTS_DIR" "contracts/"; check_file "$QUICKSTART" "quickstart.md"; fi
