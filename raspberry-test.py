from websocket import create_connection
import time
ws = create_connection("wss://iib2b26n9c.execute-api.us-east-1.amazonaws.com/test")
ws.send('{"action":"identificarme"}')
print("Receiving connectionid")
result =  ws.recv()
print("Received connectionid " + result)
ws.send('{"action":"saveSedeConnection","connectionId":' + result + ',"sedeId":"1"}')
obtained = ws.recv()
print("connectionId saved " + obtained)
time.sleep(60)
instruccion = ws.recv()
print("instrucciones " + instruccion)
ws.close()