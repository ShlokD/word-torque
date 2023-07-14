// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const word = req.query.w;
      const apiRes = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      const json = await apiRes.json();
      if (json.title === "No Definitions Found") {
        res.status(200).json({
          word,
          meanings: [],
          phonetics: [],
          sourceUrls: [],
        });
      } else {
        res.status(200).json({
          word: json[0].word,
          meanings: json[0].meanings,
          phonetics: json[0].phonetics,
          sourceUrls: json[0].sourceUrls,
        });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ err: "Something went wrong" });
    }
  }
}
