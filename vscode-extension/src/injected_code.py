def __borescope_internal_handler(var):
    import pickle
    from base64 import b64encode
    return b64encode(pickle.dumps(var)).decode()
