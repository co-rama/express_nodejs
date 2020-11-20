const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://ramadhan:ramadhan@rest.c8dmh.mongodb.net/stage_1?retryWrites=true&w=majority",
    { useUnifiedTopology: true }
  )
    .then((client) => {
      console.log("Connected!");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log('Failure');
      console.log(err.message);
    });
};
getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found";
};
exports.getDb = getDb;
exports.mongoConnect = mongoConnect;
