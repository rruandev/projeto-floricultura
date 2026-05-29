$root = $PSScriptRoot
$port = 3000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Serving at http://localhost:$port"

$mime = @{
    '.html' = 'text/html; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.svg'  = 'image/svg+xml'
    '.ico'  = 'image/x-icon'
}

while ($listener.IsListening) {
    $ctx  = $listener.GetContext()
    $req  = $ctx.Request
    $resp = $ctx.Response

    $path = $req.Url.LocalPath
    if ($path -eq '/') { $path = '/index.html' }
    $file = Join-Path $root $path.TrimStart('/')

    if (Test-Path $file -PathType Leaf) {
        $ext  = [System.IO.Path]::GetExtension($file)
        $ct   = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
        $bytes = [System.IO.File]::ReadAllBytes($file)
        $resp.ContentType   = $ct
        $resp.ContentLength64 = $bytes.Length
        $resp.StatusCode    = 200
        $resp.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $resp.StatusCode = 404
    }
    $resp.OutputStream.Close()
}
