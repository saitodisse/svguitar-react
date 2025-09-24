#!/usr/bin/env bash
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"
eval $(get_feature_paths)
check_feature_branch "$CURRENT_BRANCH" || exit 1
echo "RAIZ_DO_REPO: $REPO_ROOT"; echo "BRANCH: $CURRENT_BRANCH"; echo "DIRETORIO_DA_FEATURE: $FEATURE_DIR"; echo "SPEC_DA_FEATURE: $FEATURE_SPEC"; echo "PLANO_DA_IMPL: $IMPL_PLAN"; echo "TAREFAS: $TASKS"
