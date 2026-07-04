# PowerShell smoke test for docker compose --profile full demo
$ErrorActionPreference = "Stop"

Write-Host "Waiting for API..."
for ($i = 0; $i -lt 30; $i++) {
    try {
        $health = Invoke-RestMethod -Uri "http://localhost:4000/health" -TimeoutSec 2
        if ($health.status -eq "ok") { break }
    } catch { Start-Sleep -Seconds 2 }
}

Write-Host "API health:" (Invoke-RestMethod "http://localhost:4000/health" | ConvertTo-Json -Compress)

$products = Invoke-RestMethod "http://localhost:4000/api/products"
Write-Host "REST products count:" $products.data.Count

$gql = Invoke-RestMethod -Uri "http://localhost:4000/graphql" -Method Post `
    -ContentType "application/json" `
    -Body '{"query":"{ productCount dataProvider }"}'
Write-Host "GraphQL:" ($gql.data | ConvertTo-Json -Compress)

$web = Invoke-WebRequest -Uri "http://localhost:3000/" -UseBasicParsing
Write-Host "Web status:" $web.StatusCode

Write-Host "`nDemo OK — open http://localhost:3000"
