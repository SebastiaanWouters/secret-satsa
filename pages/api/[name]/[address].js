const superagent = require("superagent");
const PYTHON_SERVER_URL="http://162.212.158.43:5000/"

export default async function handler(req, res) {
  const address = req.query.address;
  const name = req.query.name;
  
  if (!address || !name) {
    res.status(400).send("Invalid request!!");
  }
  /*return new Promise((resolve, reject) => {
    superagent.get(`${PYTHON_SERVER_URL}sendTx?name=${name}&address=${address}`)
      .then(response => {
        res.statusCode = 200
        console.log(response)
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(JSON.stringify(response));
        resolve();
      })
      .catch(error => {
        console.log(error)
        res.json(error);
        res.status(400).end();
        resolve(); // in case something goes wrong in the catch block (as vijay commented)
      });
  });*/


  superagent.get(`${PYTHON_SERVER_URL}sendTx?name=${name}&address=${address}`).then((response) => {
   return res.status(200).send(response.text);
  }).catch((error) => {return res.status(400).send("fail")});
}
