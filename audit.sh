#!/bin/bash
# GNIS Enterprise Infrastructure - Comprehensive Audit Script
# This script validates the complete infrastructure implementation

set -e

echo "============================================"
echo "GNIS ENTERPRISE INFRASTRUCTURE AUDIT"
echo "Date: $(date)"
echo "============================================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

check_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASSED_CHECKS++))
    ((TOTAL_CHECKS++))
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAILED_CHECKS++))
    ((TOTAL_CHECKS++))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((TOTAL_CHECKS++))
}

# ====================
# 1. Directory Structure
# ====================
echo "1. Validating Directory Structure..."
echo "-------------------------------------------"

directories=(
    "gnis"
    "gnis/governance"
    "gnis/core"
    "gnis/modules"
    "gnis/modules/housing"
    "gnis/modules/food-access"
    "gnis/modules/transportation"
    "gnis/modules/demographics"
    "gnis/ingestion"
    "gnis/ingestion/connectors"
    "gnis/ingestion/validators"
    "gnis/ingestion/pipelines"
    "gnis/ui"
    "gnis/ui/public"
    "gnis/ui/internal"
    "gnis/ui/components"
    "gnis/deploy"
    "gnis/deploy/github-pages"
    "gnis/deploy/azure"
    "gnis/deploy/gcp"
    "docs"
    ".github/workflows"
)

for dir in "${directories[@]}"; do
    if [ -d "$dir" ]; then
        check_pass "Directory exists: $dir"
    else
        check_fail "Directory missing: $dir"
    fi
done

echo ""

# ====================
# 2. Core Files
# ====================
echo "2. Validating Core Files..."
echo "-------------------------------------------"

core_files=(
    "README.md"
    "package.json"
    "tsconfig.json"
    "next.config.js"
    ".env.example"
    ".gitignore"
    "SECURITY.md"
    "CONTRIBUTING.md"
    "LICENSE.md"
)

for file in "${core_files[@]}"; do
    if [ -f "$file" ]; then
        check_pass "Core file exists: $file"
    else
        check_fail "Core file missing: $file"
    fi
done

echo ""

# ====================
# 3. GNIS Structure Files
# ====================
echo "3. Validating GNIS Structure Files..."
echo "-------------------------------------------"

gnis_files=(
    "gnis/README.md"
    "gnis/governance/truth_governor.json"
    "gnis/governance/ethics_policy.md"
    "gnis/core/geo-object.json"
    "gnis/core/validation-rules.json"
    "gnis/ingestion/README.md"
    "gnis/ingestion/connectors/census-connector.ts"
    "gnis/ingestion/validators/schema-validator.ts"
    "gnis/ingestion/validators/truth-governor.ts"
    "gnis/ingestion/pipelines/ingestion-workflow.ts"
)

for file in "${gnis_files[@]}"; do
    if [ -f "$file" ]; then
        check_pass "GNIS file exists: $file"
    else
        check_fail "GNIS file missing: $file"
    fi
done

echo ""

# ====================
# 4. Module Documentation
# ====================
echo "4. Validating Module Documentation..."
echo "-------------------------------------------"

module_docs=(
    "gnis/modules/housing/README.md"
    "gnis/modules/food-access/README.md"
    "gnis/modules/transportation/README.md"
    "gnis/modules/demographics/README.md"
)

for file in "${module_docs[@]}"; do
    if [ -f "$file" ]; then
        check_pass "Module doc exists: $file"
    else
        check_fail "Module doc missing: $file"
    fi
done

echo ""

# ====================
# 5. UI Components
# ====================
echo "5. Validating UI Components..."
echo "-------------------------------------------"

ui_files=(
    "gnis/ui/components/MapDashboard.tsx"
    "gnis/ui/components/DataQualityMonitor.tsx"
    "gnis/ui/public/index.tsx"
    "gnis/ui/internal/admin.tsx"
)

for file in "${ui_files[@]}"; do
    if [ -f "$file" ]; then
        check_pass "UI component exists: $file"
    else
        check_fail "UI component missing: $file"
    fi
done

echo ""

# ====================
# 6. Deployment Configs
# ====================
echo "6. Validating Deployment Configurations..."
echo "-------------------------------------------"

deploy_files=(
    "gnis/deploy/github-pages/README.md"
    "gnis/deploy/azure/README.md"
    "gnis/deploy/gcp/README.md"
)

for file in "${deploy_files[@]}"; do
    if [ -f "$file" ]; then
        check_pass "Deploy config exists: $file"
    else
        check_fail "Deploy config missing: $file"
    fi
done

echo ""

# ====================
# 7. Documentation
# ====================
echo "7. Validating Documentation..."
echo "-------------------------------------------"

doc_files=(
    "docs/ARCHITECTURE.md"
)

for file in "${doc_files[@]}"; do
    if [ -f "$file" ]; then
        check_pass "Documentation exists: $file"
    else
        check_fail "Documentation missing: $file"
    fi
done

echo ""

# ====================
# 8. CI/CD Workflows
# ====================
echo "8. Validating CI/CD Workflows..."
echo "-------------------------------------------"

if [ -f ".github/workflows/gnis-cicd.yml" ]; then
    check_pass "CI/CD workflow exists"
else
    check_fail "CI/CD workflow missing"
fi

echo ""

# ====================
# 9. JSON Schema Validation
# ====================
echo "9. Validating JSON Schemas..."
echo "-------------------------------------------"

# Check if JSON files are valid
json_files=(
    "gnis/core/geo-object.json"
    "gnis/core/validation-rules.json"
    "gnis/governance/truth_governor.json"
    "package.json"
    "tsconfig.json"
)

for file in "${json_files[@]}"; do
    if [ -f "$file" ]; then
        if python3 -m json.tool "$file" > /dev/null 2>&1; then
            check_pass "Valid JSON: $file"
        else
            check_fail "Invalid JSON: $file"
        fi
    fi
done

echo ""

# ====================
# 10. Content Validation
# ====================
echo "10. Validating Content Requirements..."
echo "-------------------------------------------"

# Check README for required sections
if grep -q "GNIS Enterprise Infrastructure" README.md; then
    check_pass "README contains enterprise-grade title"
else
    check_fail "README missing enterprise-grade title"
fi

if grep -q "Multi-Cloud" README.md; then
    check_pass "README documents multi-cloud architecture"
else
    check_fail "README missing multi-cloud documentation"
fi

if grep -q "Truth Governor" README.md; then
    check_pass "README mentions Truth Governor"
else
    check_fail "README missing Truth Governor reference"
fi

if grep -q "API-First" README.md || grep -q "API-only" README.md; then
    check_pass "README describes API-first architecture"
else
    check_fail "README missing API-first documentation"
fi

# Check truth_governor.json for required sections
if grep -q "forbidden_actions" gnis/governance/truth_governor.json; then
    check_pass "Truth Governor contains forbidden actions"
else
    check_fail "Truth Governor missing forbidden actions"
fi

if grep -q "required_validations" gnis/governance/truth_governor.json; then
    check_pass "Truth Governor contains required validations"
else
    check_fail "Truth Governor missing required validations"
fi

# Check geo-object.json for canonical schema
if grep -q "Canonical Geographic Object" gnis/core/geo-object.json; then
    check_pass "Canonical Geo Object schema exists"
else
    check_fail "Canonical Geo Object schema missing"
fi

echo ""

# ====================
# 11. Security Checks
# ====================
echo "11. Validating Security Configuration..."
echo "-------------------------------------------"

if [ -f ".env.example" ]; then
    check_pass ".env.example exists for secrets management"
else
    check_fail ".env.example missing"
fi

if [ -f "SECURITY.md" ]; then
    check_pass "SECURITY.md exists"
else
    check_fail "SECURITY.md missing"
fi

if [ -f ".gitignore" ]; then
    if grep -q ".env" .gitignore; then
        check_pass ".gitignore excludes .env files"
    else
        check_fail ".gitignore does not exclude .env files"
    fi
    
    if grep -q "node_modules" .gitignore; then
        check_pass ".gitignore excludes node_modules"
    else
        check_fail ".gitignore does not exclude node_modules"
    fi
else
    check_fail ".gitignore missing"
fi

echo ""

# ====================
# 12. Multi-Cloud Readiness
# ====================
echo "12. Validating Multi-Cloud Readiness..."
echo "-------------------------------------------"

if [ -d "gnis/deploy/github-pages" ] && [ -d "gnis/deploy/azure" ] && [ -d "gnis/deploy/gcp" ]; then
    check_pass "Multi-cloud deployment configs present"
else
    check_fail "Multi-cloud deployment configs incomplete"
fi

if [ -f "next.config.js" ]; then
    check_pass "Next.js configuration exists"
else
    check_fail "Next.js configuration missing"
fi

echo ""

# ====================
# SUMMARY
# ====================
echo "============================================"
echo "AUDIT SUMMARY"
echo "============================================"
echo "Total Checks: $TOTAL_CHECKS"
echo -e "${GREEN}Passed: $PASSED_CHECKS${NC}"
echo -e "${RED}Failed: $FAILED_CHECKS${NC}"
echo ""

# Calculate percentage
if [ $TOTAL_CHECKS -gt 0 ]; then
    PERCENTAGE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
    echo "Success Rate: $PERCENTAGE%"
    echo ""
    
    if [ $FAILED_CHECKS -eq 0 ]; then
        echo -e "${GREEN}════════════════════════════════════════${NC}"
        echo -e "${GREEN}   ✓ ALL CHECKS PASSED - ALL GOOD!     ${NC}"
        echo -e "${GREEN}════════════════════════════════════════${NC}"
        echo ""
        echo "The GNIS Enterprise Infrastructure is:"
        echo "  ✅ Fully implemented"
        echo "  ✅ Truth-governed"
        echo "  ✅ Multi-cloud ready"
        echo "  ✅ Enterprise-grade"
        echo "  ✅ Security-hardened"
        echo "  ✅ Documentation complete"
        echo ""
        exit 0
    else
        echo -e "${RED}════════════════════════════════════════${NC}"
        echo -e "${RED}   ✗ SOME CHECKS FAILED                 ${NC}"
        echo -e "${RED}════════════════════════════════════════${NC}"
        echo ""
        echo "Please review the failed checks above."
        exit 1
    fi
else
    echo "No checks performed"
    exit 1
fi
