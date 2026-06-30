import json
import os
import urllib.request
import urllib.parse


def _tg_api(token: str, method: str, params: dict) -> dict:
    url = f'https://api.telegram.org/bot{token}/{method}'
    data = urllib.parse.urlencode(params).encode()
    req = urllib.request.Request(url, data=data)
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read().decode())


def _resolve_chat_ids(token: str) -> list:
    '''Определяет chat_id всех, кто писал боту'''
    try:
        res = _tg_api(token, 'getUpdates', {})
    except Exception:
        return []
    ids = []
    for upd in res.get('result', []):
        msg = upd.get('message') or upd.get('my_chat_member') or {}
        chat = msg.get('chat') or {}
        cid = chat.get('id')
        if cid and cid not in ids:
            ids.append(cid)
    return ids


def handler(event: dict, context) -> dict:
    '''Принимает заявку с сайта и отправляет её в Telegram владельцу'''
    method = event.get('httpMethod', 'GET')

    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    if method != 'POST':
        return {'statusCode': 405, 'headers': cors, 'body': json.dumps({'error': 'Method not allowed'})}

    token = os.environ.get('TELEGRAM_BOT_TOKEN', '')
    if not token:
        return {'statusCode': 500, 'headers': cors, 'body': json.dumps({'error': 'No token'})}

    body = json.loads(event.get('body') or '{}')
    name = str(body.get('name', '')).strip()
    phone = str(body.get('phone', '')).strip()
    message = str(body.get('message', '')).strip()

    if not phone and not name:
        return {'statusCode': 400, 'headers': cors,
                'body': json.dumps({'error': 'Укажите имя или телефон'})}

    text = (
        '🚗 Новая заявка с сайта AutoVod\n\n'
        f'👤 Имя: {name or "—"}\n'
        f'📞 Телефон: {phone or "—"}\n'
        f'📝 Сообщение: {message or "—"}'
    )

    chat_ids = _resolve_chat_ids(token)
    if not chat_ids:
        return {'statusCode': 200, 'headers': cors,
                'body': json.dumps({'ok': False,
                                    'error': 'Напишите боту любое сообщение в Telegram, чтобы он мог присылать заявки'},
                                   ensure_ascii=False)}

    sent = 0
    for cid in chat_ids:
        try:
            _tg_api(token, 'sendMessage', {'chat_id': cid, 'text': text})
            sent += 1
        except Exception:
            pass

    return {'statusCode': 200, 'headers': cors,
            'body': json.dumps({'ok': sent > 0}, ensure_ascii=False)}
