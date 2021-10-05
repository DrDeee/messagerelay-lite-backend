# Payloads

## Types
- error - If an error occurs
```json
{
    "type": "error",
    "msg": "error message"
}
```
- verified - If the websocket gets verified
```json
{
    "type": "verified",
}
```
- code - Containing a code to verify this websocket session
```json
{
    "type": "code",
    "code": "random string"
}
```
- create - If a new message have to be send
```json
{
  "type": "create",
  "id": 1313131313,
  "target": "wid oder iaow",
  "content": "<hier>der <HTML></code>"
}
```
- delete - If a message should be deletet+d
```json
{
  "type": "delete",
  "id": 1313131313,
}
```