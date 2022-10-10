const ogs = require("open-graph-scraper");

export default async function handler(req, res) {
  const query = req.query;
  const { url } = query;
  const options = { url };

  await ogs(options).then((data) => {
    const { result } = data;
    if (result.success) {
      res.status(200).json({ result });
      return;
    } else {
      res.status(400).json({ result });
    }
  });
}
