import os
import bdkpython as bdk

from flask import Flask
from flask import request
from dotenv import load_dotenv
from flask_cors import CORS, cross_origin
import json
load_dotenv('.env')


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

with open('authlist.json') as f:
        AUTH_LIST = json.load(f)

FEE = 2
LEFTOVER = 'some address'
FUNDED_WIF = os.environ.get("WIF")
PRIVATE_KEY = os.environ.get("PRIV_KEY")
RETURN_ADDRESS = 'bc1qwgs2pwyd4fupdqeknz4qhjzdzjd56uv8x04rjm0w30ac4ytajdsqxjjd79'
RETURN_ADDRESS2 = '3MPmgKHnKLAWtmc25b9Xi1vjdksCG8Vq5L'
API_ENDPOINT = "https://blockstream.info/api/tx"


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/sendTx")
@cross_origin()
def sendTx():
    try:
        toAddress = request.args.get('address', default = '', type = str)
        user = request.args.get('name', default = '', type = str)

        if (user in AUTH_LIST):
            AMOUNT = AUTH_LIST[user]
        else:
            return {'error': 'user not authorized'}, 400
            
        descriptor = "wpkh([dcb33745/84h/0h/0h]{}/0/*)".format(PRIVATE_KEY)
        db_config = bdk.DatabaseConfig.MEMORY()
        blockchain_config = bdk.BlockchainConfig.ELECTRUM(
            bdk.ElectrumConfig(
                "ssl://electrum.blockstream.info:50002",
                None,
                5,
                None,
                100
            )
        )

        blockchain = bdk.Blockchain(blockchain_config)

        wallet = bdk.Wallet(
                    descriptor=descriptor,
                    change_descriptor=None,
                    network=bdk.Network.BITCOIN,
                    database_config=db_config,
                )
        wallet.sync(blockchain, None)
        
        builder = bdk.TxBuilder()
        address = bdk.Address("{}".format(toAddress))
        script = address.script_pubkey()
        builder = builder.add_recipient(script, AMOUNT)
        psbt = builder.finish(wallet).psbt
        txid = psbt.txid()
        #wallet.sign(psbt)
        #blockchain.broadcast(psbt)

        AUTH_LIST[user] = 0

        with open("authlist.json", "w") as jsonFile:
            json.dump(AUTH_LIST, jsonFile)
        
        return {"txid": txid}, 200

    except Exception as e: 
        print(e)
        return {"error": "fail"}, 400

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0',port=int(os.environ.get('PORT', 5000)))
