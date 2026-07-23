$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$failures = [System.Collections.Generic.List[string]]::new()

function Read-ProjectFile([string]$relativePath) {
  $path = Join-Path $root $relativePath
  if (-not (Test-Path -LiteralPath $path)) {
    $failures.Add("Missing file: $relativePath")
    return ""
  }
  return Get-Content -Raw -Encoding utf8 -LiteralPath $path
}

function Decode-Utf8([string]$base64) {
  return [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($base64))
}

function Assert-Contains([string]$content, [string]$needle, [string]$message) {
  if (-not $content.Contains($needle)) {
    $failures.Add($message)
  }
}

function Assert-NotContains([string]$content, [string]$needle, [string]$message) {
  if ($content.Contains($needle)) {
    $failures.Add($message)
  }
}

function Assert-InOrder([string]$content, [string[]]$needles, [string]$message) {
  $lastIndex = -1
  foreach ($needle in $needles) {
    $index = $content.IndexOf($needle, [System.StringComparison]::Ordinal)
    if ($index -lt 0 -or $index -le $lastIndex) {
      $failures.Add("$message (failed at: $needle)")
      return
    }
    $lastIndex = $index
  }
}

$index = Read-ProjectFile "index.html"
$archive = Read-ProjectFile "archive.html"
$cv = Read-ProjectFile "cv.html"
$data = Read-ProjectFile "portfolio-data.js"
$ui = Read-ProjectFile "portfolio-ui.js"
$amp = [char]38

# Recruiter-facing identity and hierarchy.
Assert-Contains $index ("Global B2B Sales " + $amp + "amp; Brand Operations") "Hero/nav role title is incorrect."
Assert-Contains $index (Decode-Utf8 "Sy1CZWF1dHkg7ZW07Jm47JiB7JeFIC8g6riA66Gc67KMIEIyQg==") "Desired K-Beauty role is not explicit."
Assert-Contains $index "Italian Luxury " "Italian Luxury transition is missing."
Assert-Contains $index (Decode-Utf8 "N+uFhA==") "Seven-year experience statement is missing."
Assert-InOrder $index @(
  "Global Account Management",
  "New Market Development",
  ("Brand " + $amp + "amp; Market Communication"),
  "AI-Enabled Operations"
) "Capabilities are missing or incorrectly ordered."

# Selected Work must use the requested evidence structure.
foreach ($label in @("Role", "Scope", "Actions", "Outcome")) {
  $labelPattern = 'work-case-label">' + $label + '<'
  if (([regex]::Matches($index, $labelPattern)).Count -lt 3) {
    $failures.Add("Selected Work does not show '$label' for all three employer cases.")
  }
}
Assert-InOrder $index @(("T" + $amp + "amp;S Trading"), "Saturn Bath", "Mondrian AI") "Selected Work employer order is incorrect."

# Unsupported or interview-risky wording.
$allCareerCopy = "$index`n$cv"
$banned = @(
  (Decode-Utf8 "7ZWc6rWtIOyLnOyepSDri6jrj4Ug7LGF7J6E"),
  (Decode-Utf8 "7ZWc6rWtIOy7pOuupOuLiOy8gOydtOyFmCDri6jrj4Ug7LSd6rSE"),
  ("0" + [char]0x2192 + "6 markets"),
  ("0 " + [char]0x2192 + " 6 markets"),
  (Decode-Utf8 "NuqwnOq1rSDqsbDrnpjshKAg7ZmV67O0"),
  (Decode-Utf8 "NuqwnOq1rSDsi6Dqt5wg6rGw656Y7ISgIO2ZleuztA=="),
  (Decode-Utf8 "6rOE7JW9IO2BtOuhnOynleq5jOyngCDsoIQg7IKs7J207YG0"),
  "AI-Native Marketer",
  "AI-Native Operator"
)
foreach ($term in $banned) {
  Assert-NotContains $allCareerCopy $term "Unsupported wording remains."
}

# Canonical archive data and shared rendering.
Assert-Contains $index '<script src="portfolio-data.js" defer></script>' "Homepage does not load canonical data."
Assert-Contains $archive '<script src="portfolio-data.js" defer></script>' "Archive does not load canonical data."
Assert-Contains $index 'data-portfolio-latest' "Homepage has no latest-issues render hook."
Assert-Contains $archive 'data-portfolio-archive' "Archive has no shared render hook."
Assert-Contains $ui "PORTFOLIO_DATA" "Shared UI does not consume canonical data."
Assert-Contains $data 'edition: "03"' "Canonical Edition is not 03."
Assert-Contains $data 'updated: "2026.07.23"' "Canonical update date is not current."

$issueCount = ([regex]::Matches($data, 'url:\s*"https://www\.instagram\.com/p/')).Count
if ($issueCount -ne 9) {
  $failures.Add("Canonical archive must contain 9 issues; found $issueCount.")
}
$strategyCount = ([regex]::Matches($data, 'category:\s*"strategy"')).Count - 1
$researchCount = ([regex]::Matches($data, 'category:\s*"research"')).Count - 1
if ($strategyCount -ne 7 -or $researchCount -ne 2) {
  $failures.Add("Archive category counts must be 7 strategy / 2 research.")
}
Assert-NotContains $archive ">0 entries<" "Archive still has a zero-entry fallback."
Assert-NotContains $archive ">00<" "Archive still has a 00 category fallback."

# Archive positioning and interaction.
$archiveTerms = @(
  (Decode-Utf8 "7KCc7ZKIIFVTUA=="),
  (Decode-Utf8 "7Jyg7Ya1IOyxhOuEkA=="),
  (Decode-Utf8 "7Iuc7J6lIOynhOyehQ=="),
  (Decode-Utf8 "6riA66Gc67KMIO2ZleyepSDqsIDriqXshLE=")
)
foreach ($term in $archiveTerms) {
  Assert-Contains $archive $term "Archive introduction is missing a global-business lens term."
}
foreach ($filter in @('data-filter="all"', 'data-filter="strategy"', 'data-filter="research"')) {
  Assert-Contains $archive $filter "Archive filter is missing."
}
Assert-Contains $ui "applyArchiveFilter" "Shared UI does not initialize archive filters."

# Mobile overflow safeguards.
Assert-Contains $index "overflow-x: hidden" "Homepage lacks horizontal overflow protection."
if ($index -notmatch '(?s)@media\s*\(max-width:\s*760px\).*?\.nav-status\s*\{\s*display:\s*none') {
  $failures.Add("Mobile homepage does not hide the long status label.")
}
if ($index -notmatch '(?s)@media\s*\(max-width:\s*760px\).*?\.hero-stamp\s*\{[^}]*grid-template-columns:\s*20px\s+minmax\(0,\s*1fr\)') {
  $failures.Add("Mobile hero stamp does not use a shrink-safe layout.")
}

# Required local navigation and assets.
foreach ($local in @("index.html", "archive.html", "cv.html", "profile.jpg")) {
  if (-not (Test-Path -LiteralPath (Join-Path $root $local))) {
    $failures.Add("Missing required local page or asset: $local")
  }
}
Assert-Contains $index 'href="archive.html"' "Homepage does not link to archive."
Assert-Contains $archive 'href="index.html"' "Archive does not link to homepage."

if ($failures.Count -gt 0) {
  Write-Host "Portfolio checks failed ($($failures.Count)):" -ForegroundColor Red
  $failures | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "Portfolio checks passed: identity, accuracy, data, filters, links, and mobile safeguards." -ForegroundColor Green
