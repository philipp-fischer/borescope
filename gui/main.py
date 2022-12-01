from base64 import b64decode
import socketserver
import pickle


class MyTCPHandler(socketserver.BaseRequestHandler):
    def handle(self):
        data = self.request.recv(1024).strip()
        if data.startswith(b"BORESCOPE:"):
            b64_data = data[10:]
            print(pickle.loads(b64decode(b64_data)))


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    HOST, PORT = "localhost", 8023  # BORE

    with socketserver.TCPServer((HOST, PORT), MyTCPHandler) as server:
        server.serve_forever()
