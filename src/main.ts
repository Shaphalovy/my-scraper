import express from 'express';
import { PlaywrightCrawler, Dataset } from 'crawlee';

const app = express();
app.use(express.json());

app.get('/scrape', async (req, res) => {
    const targetUrl = req.query.url as string;

    if (!targetUrl) {
        return res.status(400).json({ error: 'Missing url query parameter' });
    }

    const results: any[] = [];

      const crawler = new PlaywrightCrawler({
        maxRequestsPerCrawl: 1,
        requestHandler: async ({ page, request }) => {
            const title = await page.title();
            const bodyText = await page.evaluate(() => document.body.innerText);

            results.push({
                url: request.loadedUrl,
                title,
                text: bodyText.slice(0, 5000),
            });
        },
    });

    await crawler.run([targetUrl]);

    return res.json({ data: results });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Scraper API running on port ${PORT}`);
});