const mongosse=require("mongoose");
const initdata=require("./data.js");
const listing=require("../modules/listing.js")
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongosse.connect(MONGO_URL);
}
const initDB = async () => {
    await listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"658455a5a03b39c6ad8e69df"}));
    await listing.insertMany(initdata.data);
    console.log("data was initialized");
  };
  
  initDB();