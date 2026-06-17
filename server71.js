const express = require("express");
const cors = require("cors");
const { createClient } = require("redis");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Redis Client
const redisClient = createClient();

redisClient.on("error", (err) =>
    console.log("Redis Error:", err)
);

(async () => {
    await redisClient.connect();
    console.log("Redis Connected");
})();

// API with Redis Cache
app.get("/data", async (req, res) => {

    const cacheData =
        await redisClient.get("userData");

    if (cacheData) {
        return res.json({
            source: "Redis Cache",
            data: JSON.parse(cacheData)
        });
    }

    // Simulated Database Data
    const userData = {
        id: 1,
        name: "Janushiya",
        course: "Computer Science"
    };

    // Store in Redis for 60 seconds
    await redisClient.set(
        "userData",
        JSON.stringify(userData),
        { EX: 60 }
    );

    res.json({
        source: "Database",
        data: userData
    });
});

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});