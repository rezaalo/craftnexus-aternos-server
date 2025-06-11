
import Aternos from "mc-aternos";
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

const aternos = new Aternos("rdaa00010@gmail.com", "rdaa1983");

app.get("/start", async (req, res) => {
  try {
    await aternos.login();
    const servers = await aternos.getServers();
    const server = servers[0];

    await server.fetch();
    await server.start();

    let status = server.getStatus();
    let tries = 0;

    while (status !== "online" && tries < 20) {
      await new Promise((r) => setTimeout(r, 5000));
      await server.fetch();
      status = server.getStatus();
      tries++;
    }

    if (status === "online") {
      return res.json({
        status: "online",
        address: server.address,
        message: "الخادم اشتغل بنجاح!"
      });
    } else {
      return res.json({
        status: "pending",
        message: "الخادم لسه ما اشتغل. حاول بعد شوي."
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "صار خطأ أثناء تشغيل الخادم.",
      error: err.toString()
    });
  }
});

app.get("/", (req, res) => {
  res.send("🟢 CraftNexus Aternos Server API جاهز!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
