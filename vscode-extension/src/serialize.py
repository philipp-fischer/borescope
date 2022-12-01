import pickle
import base64

def borescope_serialize(v):
    return base64.b64encode(str(v))
