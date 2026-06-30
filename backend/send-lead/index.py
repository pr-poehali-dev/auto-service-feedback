import json
import os
import urllib.request
import urllib.parse


def _tg_send(token: str, chat_id: str, text: str) -> bool:
    url = f'https://api.telegram.org/bot{token}/sendMessage'
    params = urllib.parse.urlencode({'chat_id': chat_id, 'text': text})
    req = urllib.request.Request(url, params.encode())
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read().decode())
        return data.get('ok', False)


def handler(event: dict, context) -> dict:
    '''Принимает заявку с сайта и отправляет её в Telegram владельцу'''
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    if event.get('httpMethod') != 'POST':
        return {'statusCode': 405, 'headers': cors, 'body': json.dumps({'error': 'Method not allowed'})}

    token = os.environ.get('TELEGRAM_BOT_TOKEN', '')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID', '')

    if not token or not chat_id:
        return {'statusCode': 500, 'headers': cors,
                'body': json.dumps({'error': 'Бот не настроен'}, ensure_ascii=False)}

    body = json.loads(event.get('body') or '{}')
    name = str(body.get('name', '')).strip()
    phone = str(body.get('phone', '')).strip()
    message = str(body.get('message', '')).strip()

    if not phone and not name:
        return {'statusCode': 400, 'headers': cors,
                'body': json.dumps({'error': 'Укажите имя или телефон'}, ensure_ascii=False)}

    text = (
        '🚗 Новая заявка с сайта AutoVod\n\n'
        f'👤 Имя: {name or "—"}\n'
        f'📞 Телефон: {phone or "—"}\n'
        f'📝 Сообщение: {message or "—"}'
    )

    ok = _tg_send(token, chat_id, text)
    return {'statusCode': 200, 'headers': cors,
            'body': json.dumps({'ok': ok}, ensure_ascii=False)}
