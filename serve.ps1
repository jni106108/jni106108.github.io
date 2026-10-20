# Servidor local do Lancer Garagem (somente neste PC): http://localhost:8080
param([int]$Porta = 8080, [switch]$SemNavegador)
$raiz = $PSScriptRoot
$tipos = @{
  '.html' = 'text/html; charset=utf-8'; '.js' = 'text/javascript; charset=utf-8'; '.css' = 'text/css; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'; '.jpg' = 'image/jpeg'; '.png' = 'image/png'; '.svg' = 'image/svg+xml'
  '.pdf' = 'application/pdf'; '.ico' = 'image/x-icon'; '.webmanifest' = 'application/manifest+json'
}
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add("http://localhost:$Porta/")
try { $l.Start() } catch { Write-Host "Porta $Porta ocupada. Tente: .\serve.ps1 -Porta 8090"; exit 1 }
Write-Host "Lancer Garagem rodando em http://localhost:$Porta  (Ctrl+C para parar)"
if (-not $SemNavegador) { Start-Process "http://localhost:$Porta/" }
while ($l.IsListening) {
  $ctx = $l.GetContext(); $res = $ctx.Response
  try {
    $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart('/')
    if ($rel -eq '') { $rel = 'index.html' }
    $arq = [IO.Path]::GetFullPath((Join-Path $raiz $rel))
    if (-not $arq.StartsWith($raiz) -or -not [IO.File]::Exists($arq)) { $res.StatusCode = 404 }
    else {
      $ext = [IO.Path]::GetExtension($arq).ToLower()
      $res.ContentType = $(if ($tipos[$ext]) { $tipos[$ext] } else { 'application/octet-stream' })
      $res.Headers.Add('Cache-Control', 'no-cache')
      $fs = [IO.File]::OpenRead($arq); $res.ContentLength64 = $fs.Length; $fs.CopyTo($res.OutputStream); $fs.Close()
    }
  } catch { try { $res.StatusCode = 500 } catch {} }
  try { $res.Close() } catch {}
}
