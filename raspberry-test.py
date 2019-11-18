from websocket import create_connection
import time
import json
import requests 
carSizeSensores = '11110'
miSede = '2'
ws = create_connection("wss://iib2b26n9c.execute-api.us-east-1.amazonaws.com/test")
ws.send('{"action":"identificarme"}')
print("Receiving connectionid")
result =  ws.recv()
print("Received connectionid " + result)
ws.send('{"action":"saveSedeConnection","connectionId":' + result + ',"sedeId":"' + miSede + '"}')
obtained = ws.recv()
print("connectionId saved " + obtained)
while True:
	instruccion = ws.recv()
	print("instrucciones " + instruccion)
	jsonData = json.loads(instruccion)
	jsonToSend = json.dumps({
	  "carSizeBin": carSizeSensores,
	  "user": jsonData["userId"],
	  "paymentMethod": jsonData["metodoPago"],
	  "scannedCode": jsonData["codigoLeido"],
	  "sede": miSede
	})
	URL = 'https://flgjlel78g.execute-api.us-east-1.amazonaws.com/test/lavar'
	print(URL)
	r = requests.post(url = URL, data = jsonToSend)
	print('getting response')
	print(r.text)
