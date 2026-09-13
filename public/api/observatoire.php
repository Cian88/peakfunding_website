<?php
declare(strict_types=1);
// Hostinger Web/Cloud, PHP 8+ with cURL and DOM. Public read-only endpoint.
// No user-supplied URL, credentials, tracking, or client information sent upstream.
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
if (!in_array($_SERVER['REQUEST_METHOD'] ?? 'GET', ['GET', 'HEAD'], true)) {
    http_response_code(405); header('Allow: GET, HEAD'); exit;
}
function pf_valid(array $d): bool {
    $url = parse_url($d['sourceUrl'] ?? '');
    return preg_match('/^\d{4}-(0[1-9]|1[0-2])$/', $d['period'] ?? '') === 1
        && $d['period'] >= '2000-01' && $d['period'] <= gmdate('Y-m')
        && is_numeric($d['rate'] ?? null) && $d['rate'] > 0 && $d['rate'] <= 20
        && is_int($d['durationMonths'] ?? null) && $d['durationMonths'] >= 12 && $d['durationMonths'] <= 480
        && ($url['scheme'] ?? '') === 'https' && ($url['host'] ?? '') === 'lobservatoire.creditlogement.fr'
        && !isset($url['user']) && !isset($url['port']) && str_starts_with($url['path'] ?? '', '/publications/');
}
function pf_extract(string $html): array {
    libxml_use_internal_errors(true);
    $doc = new DOMDocument();
    $doc->loadHTML('<?xml encoding="UTF-8">' . $html, LIBXML_NONET | LIBXML_NOERROR | LIBXML_NOWARNING);
    libxml_clear_errors();
    $xp = new DOMXPath($doc);
    $cls = fn(string $c): string => "contains(concat(' ',normalize-space(@class),' '),' $c ')";
    $panels = $xp->query('//*[' . $cls('last-post-panel') . ']');
    if ($panels->length !== 1) throw new RuntimeException('panel');
    $panel = $panels->item(0);
    $text = fn(string $q, $context): string => trim(preg_replace('/\s+/u', ' ', $xp->evaluate('string(' . $q . ')', $context)));
    $date = $text('.//*[' . $cls('last-post-date') . ']', $panel);
    $months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
    if (!preg_match('/^([^ ]+) (\d{4})$/u', $date, $m)) throw new RuntimeException('date');
    $month = array_search(strtolower(strtr($m[1], ['É'=>'é','Û'=>'û','À'=>'à'])), $months, true);
    if ($month === false) throw new RuntimeException('month');
    $values = [];
    foreach ($xp->query('.//*[' . $cls('last-post-card--metric') . ']', $panel) as $card) {
        $label = $text('.//h3', $card);
        if (isset($values[$label])) throw new RuntimeException('duplicate');
        $values[$label] = $text('.//*[' . $cls('last-post-value') . ']', $card);
    }
    if (!preg_match('/^(\d{1,2}[,.]\d{1,2})\s*%$/u', $values['Taux moyen'] ?? '', $rate)
        || !preg_match('/^(\d{2,3})\s*mois$/u', $values['Durée moyenne'] ?? '', $duration)) throw new RuntimeException('metrics');
    $url = $text('.//*[' . $cls('last-post-actions') . ']//a[contains(@href,"/publications/")][1]/@href', $panel);
    $data = ['period'=>$m[2].'-'.sprintf('%02d', $month+1), 'rate'=>(float)str_replace(',', '.', $rate[1]), 'durationMonths'=>(int)$duration[1], 'sourceUrl'=>$url, 'checkedAt'=>gmdate('c'), 'stale'=>false];
    if (!pf_valid($data)) throw new RuntimeException('validation');
    return $data;
}

$seed = json_decode(file_get_contents(__DIR__.'/observatoire-seed.json'), true);
if (!is_array($seed) || !pf_valid($seed)) { http_response_code(503); echo '{"error":"unavailable"}'; exit; }
// Cache and lock outside the web root; only public market data is stored.
$path = sys_get_temp_dir().'/peak-observatoire-'.hash('sha256', __DIR__).'.json';
$lock = @fopen($path.'.lock', 'c');
$cache = is_file($path) ? json_decode((string)@file_get_contents($path), true) : null;
$data = is_array($cache['data'] ?? null) && pf_valid($cache['data']) && $cache['data']['period'] >= $seed['period'] ? $cache['data'] : $seed;
$due = !is_array($cache) || ($cache['retryAt'] ?? 0) <= time();
if ($due && $lock && flock($lock, LOCK_EX | LOCK_NB)) {
    try {
        if (!function_exists('curl_init') || !class_exists('DOMDocument')) throw new RuntimeException('extensions');
        $curl = curl_init('https://lobservatoire.creditlogement.fr/');
        $html = '';
        curl_setopt_array($curl, [CURLOPT_FOLLOWLOCATION=>false, CURLOPT_CONNECTTIMEOUT=>3, CURLOPT_TIMEOUT=>8, CURLOPT_SSL_VERIFYPEER=>true, CURLOPT_SSL_VERIFYHOST=>2, CURLOPT_HTTPHEADER=>['Accept: text/html'], CURLOPT_WRITEFUNCTION=>function($handle, $chunk) use (&$html) { if (strlen($html)+strlen($chunk)>2000000) return 0; $html.=$chunk; return strlen($chunk); }]);
        $ok = curl_exec($curl); $code = curl_getinfo($curl, CURLINFO_RESPONSE_CODE); curl_close($curl);
        if ($ok === false || $code !== 200) throw new RuntimeException('upstream');
        $next = pf_extract($html);
        if ($next['period'] < $data['period']) throw new RuntimeException('older');
        $data = $next; $retryAt = time()+21600;
    } catch (Throwable $e) { $data['stale']=true; $retryAt=time()+600; }
    $temporary = @tempnam(sys_get_temp_dir(), 'peak-obs-');
    if ($temporary) {
        @chmod($temporary, 0600);
        if (@file_put_contents($temporary, json_encode(['data'=>$data,'retryAt'=>$retryAt], JSON_UNESCAPED_UNICODE)) !== false) @rename($temporary, $path);
        if (is_file($temporary)) @unlink($temporary);
    }
    flock($lock, LOCK_UN);
} elseif ($due) { $data['stale']=true; }
if ($lock) fclose($lock);
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'HEAD') echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
